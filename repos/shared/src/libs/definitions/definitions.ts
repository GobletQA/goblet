import type { Repo, TDefinitionFileModel } from '@GSH/types'

import path from 'path'
import { glob } from 'glob'
import { getSupportFiles } from './supportFiles'
import { getPathFromBase } from '@gobletqa/goblet'
import { ApiLogger as Logger } from '@gobletqa/logger'
import { DefinitionsParser } from './definitionsParser'
import { InternalPaths } from '@gobletqa/environment/constants'
import { parkinOverride } from '@GSH/libs/overrides/parkinOverride'
import { GlobOnlyFiles, GlobJSFiles } from '@gobletqa/environment/constants'

let __DefCacheEnabled = false

/**
 * Cache holder for internal goblet definitions, so they don't have to be reloaded each time
 */
let __CachedGobletDefs:TDefinitionFileModel[]
let __CachedRepoDefs:TDefinitionFileModel[]

export const removeRepoCacheDefs = () => {
  Logger.info(`Removing cached repo defs...`)
  __CachedRepoDefs = undefined
}

/**
 * Builds the definitions models from the loaded definitions
 */
const parseDefinitions = async (
  repo:Repo,
  definitionFiles:string[],
  overrideParkin:(...args:any) => any,
) => {
  return definitionFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const fileModel = await DefinitionsParser.getDefinitions(file, repo, overrideParkin)
    fileModel && loaded.push(fileModel)

    // Clear out the definitions after they have been loaded
    // Need to handle this better
    // Because the Parkin instance is reused
    // already loaded step definitions could be added again when the file is parsed
    // This clears them out from parkin, but we lose our step cache
    // Normally thats fine for Web UI, but not in other cases
    // DefinitionsParser.clear(repo)

    return loaded
  }, Promise.resolve([] as TDefinitionFileModel[]))
}

/**
 * Caches the internal goblet step definitions so they don't have to be reloaded each time
 */
const getGobletDefs = async (
  repo:Repo,
  overrideParkin:(...args:any) => any,
  cache:boolean=true
) => {

  if(__DefCacheEnabled && cache && __CachedGobletDefs?.length){
    injectStepsIntoParkin(repo, __CachedGobletDefs)

    return __CachedGobletDefs
  }

  // import { aliases } from '@gobletqa/configs/aliases.config'
  // TODO: update this to pull from the aliases, something like this
  // cwd: path.join(aliases[`@gobletqa/testify`], `steps`)
  const definitionFiles = await glob(GlobJSFiles, {
    ...GlobOnlyFiles,
    cwd: path.join(InternalPaths.testifyDir, `src/steps`)
  })

  const loadedDefs = await parseDefinitions(repo, definitionFiles, overrideParkin)
  if(__DefCacheEnabled) __CachedGobletDefs = loadedDefs

  return loadedDefs
}


/**
 * Loads repo specific step definitions
 * **IMPORTANT** - These should be loaded from the `repo.paths.stepsDir`
 * The `gobletConfig.paths.stepsDir` should **NOT** be used
 * Because it is not the path mounted repos step definitions
 *
 */
const getRepoDefinitions = async (
  repo:Repo,
  overrideParkin:(...args:any) => any,
  cache:boolean=true
) => {
  
  if(__DefCacheEnabled && cache && __CachedRepoDefs?.length){
    injectStepsIntoParkin(repo, __CachedRepoDefs)

    return __CachedRepoDefs
  }

  const { stepsDir } = repo.paths
  if(!stepsDir) return []

  const definitionFiles = await glob(GlobJSFiles, {
    ...GlobOnlyFiles,
    cwd: getPathFromBase(stepsDir, repo)
  })

  const repoDefs = await parseDefinitions(repo, definitionFiles, overrideParkin) || []
  if(__DefCacheEnabled) __CachedRepoDefs = repoDefs

  return repoDefs
}


/**
 * Not currently used, needs some work
 */
const loadDefinition = async (
  location:string,
  repo:Repo,
) => {
  repo.refreshWorld()
  const overrideParkin = parkinOverride(repo)
  const fileModel = await DefinitionsParser.getDefinitions(location, repo, overrideParkin)
  // TODO: need methods for pulling the definitions from park by name
  // Until then we can't parse a single definition by it's self
  return fileModel
}


/**
 * Injects that cache steps into the repo parkin instance
 */
const injectStepsIntoParkin = (repo:Repo, defFiles:TDefinitionFileModel[]) => {
  const existing = repo.parkin.steps.list()

  defFiles.forEach((defFile) => {
    defFile.ast.definitions.forEach(def => {
      if(!def.type) return

      const internalType = `_${def.type}`

      const validDef = existing.reduce(
        (validated, def) => (!validated || def.name === validated.name || def.uuid === validated.uuid)
          ? false
          : validated,
        def
      )

      validDef && repo.parkin.steps?.[internalType]?.push(validDef)
    })
  })
}

/**
 * Loads the definitions file from the passed in repo instance
 */
export const loadDefinitions = async (
  repo:Repo,
  cache:boolean=true
) => {

  if(__DefCacheEnabled && cache && __CachedRepoDefs?.length && __CachedGobletDefs?.length){
    const joined = __CachedGobletDefs.concat(__CachedRepoDefs)
    injectStepsIntoParkin(repo, joined)

    return joined
  }

  // Clear out any steps that were already loaded
  DefinitionsParser.clear(repo)

  // The repo world may have been updated since the last time load definitions was called
  // Call refreshWorld to ensure repo and parkin have an updated world
  repo.refreshWorld()
  const overrideParkin = parkinOverride(repo)
  const clientDefinitions = await getRepoDefinitions(repo, overrideParkin, cache)
  const gobletDefinitions = await getGobletDefs(repo, overrideParkin, cache)

  // TODO: look into returned the support fileModels to the frontend
  // For now we just load them
  // const supportFiles = await getSupportFiles(repo, overrideParkin)
  await getSupportFiles(repo, overrideParkin)

  // all the definition file models,
  // Concat client defs into goblet defs
  // This allows client defs of the same name to override goblet defs
  const defs = gobletDefinitions.concat(clientDefinitions)

  return defs
}
