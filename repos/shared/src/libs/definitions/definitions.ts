import type { Repo, TDefinitionFileModel } from '@GSH/types'

import path from 'path'
import { glob } from 'glob'
import { getSupportFiles } from './supportFiles'
import { getPathFromBase } from '@gobletqa/goblet'
import { DefinitionsParser } from './definitionsParser'
import { InternalPaths } from '@gobletqa/environment/constants'
import { parkinOverride } from '@GSH/libs/overrides/parkinOverride'
import { GlobOnlyFiles, GlobJSFiles } from '@gobletqa/environment/constants'

/**
 * Cache holder for internal goblet definitions, so they don't have to be reloaded each time
 */
let __CachedGobletDefs:TDefinitionFileModel[]
let __CachedRepoDefs:TDefinitionFileModel[]

export const removeGobletCacheDefs = () => {
  __CachedGobletDefs = undefined
  __CachedRepoDefs = undefined
}

export const removeRepoCacheDefs = () => {
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
  if(cache && __CachedGobletDefs?.length) return __CachedGobletDefs

  const definitionFiles = await glob(GlobJSFiles, {
    ...GlobOnlyFiles,
    cwd: path.join(InternalPaths.testUtilsDir, `src/steps`)
  })

  const loadedDefs = await parseDefinitions(repo, definitionFiles, overrideParkin)
  __CachedGobletDefs = loadedDefs

  return __CachedGobletDefs
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

  const { stepsDir } = repo.paths
  if(!stepsDir) return []

  const definitionFiles = await glob(GlobJSFiles, {
    ...GlobOnlyFiles,
    cwd: getPathFromBase(stepsDir, repo)
  })

  return await parseDefinitions(repo, definitionFiles, overrideParkin) || []
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
 * Loads the definitions file from the passed in repo instance
 */
export const loadDefinitions = async (
  repo:Repo,
  cache:boolean=true
) => {
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
