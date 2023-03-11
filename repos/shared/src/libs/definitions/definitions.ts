import type { TRepo, TDefinitionFileModel, TDefGobletConfig } from '@GSH/types'

import path from 'path'
import glob from 'glob'
import { noOpObj } from '@keg-hub/jsutils'
import { DefinitionsParser } from './definitionsParser'
import { getPathFromBase } from '@GSH/utils/getPathFromBase'
import { parkinOverride } from '@GSH/libs/overrides/parkinOverride'
import { getDefaultGobletConfig } from '@GSH/goblet/getDefaultGobletConfig'

/**
 * Cache holder for internal goblet definitions, so they don't have to be reloaded each time
 */
let __CachedGobletDefs:TDefinitionFileModel[]

/**
 * Searches the step definition directory for step definitions
 */
export const loadDefinitionsFiles = (stepsDir:string, opts:Record<string, any>=noOpObj):Promise<string[]> => {
  return new Promise((res, rej) => {
    // TODO: Investigate if it's better to include the ignore
    // Would make loading the definitions faster, but
    // Would mean users can't use index files
    // Would look like this { ignore: [ '**/index.js' ] }
    // For the section argument passed to the glob pattern
    glob(path.join(stepsDir, '**/*.js'), opts, async (err, files = []) => {
      err || !files
        ? rej('No step definition files found in ' + stepsDir)
        : res(files)
    })
  })
}

/**
 * Builds the definitions models from the loaded definitions
 */
const parseDefinitions = async (
  repo:TRepo,
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
  repo:TRepo,
  overrideParkin:(...args:any) => any,
  gobletConfig:TDefGobletConfig,
  cache:boolean=true
) => {
  if(cache && __CachedGobletDefs?.length) return __CachedGobletDefs 

  const definitionFiles = await loadDefinitionsFiles(
    `${gobletConfig.internalPaths.testUtilsDir}/src/steps`,
    { ignore: [ '**/index.js', '**/index.ts', ] }
  )

  const loadedDefs = await parseDefinitions(repo, definitionFiles, overrideParkin)
  __CachedGobletDefs = loadedDefs

  return __CachedGobletDefs
}

/**
 * Loads repo specific step definitions
 * **IMPORTANT** - These should be loaded from the `repo.paths.stepsDir`
 * The `gobletConfig.paths.stepsDir` should **NOT** be used
 * Because tt is not the path mounted repos step definitions
 *
 */
const getRepoDefinitions = async (
  repo:TRepo,
  overrideParkin:(...args:any) => any,
) => {

  const { stepsDir } = repo.paths
  const pathToSteps = getPathFromBase(stepsDir, repo)
  const definitionFiles = stepsDir && (await loadDefinitionsFiles(pathToSteps))

  return await parseDefinitions(repo, definitionFiles, overrideParkin) || []
}


/**
 * Not currently used, needs some work
 */
const loadDefinition = async (
  location:string,
  repo:TRepo,
) => {
  await repo.refreshWorld()
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
  repo:TRepo,
  gobletConfig?:TDefGobletConfig,
  cache:boolean=true
) => {
  // Clear out any steps that were already loaded
  DefinitionsParser.clear(repo)
  gobletConfig = gobletConfig || getDefaultGobletConfig()

  // The repo world may have been updated since the last time load definitions was called
  // Call refreshWorld to ensure repo and parkin have an updated world
  await repo.refreshWorld()
  const overrideParkin = parkinOverride(repo)
  
  const clientDefinitions = await getRepoDefinitions(repo, overrideParkin)
  const gobletDefinitions = await getGobletDefs(repo, overrideParkin, gobletConfig, cache)

  // all the definition file models
  const defs = clientDefinitions.concat(gobletDefinitions)

  return defs
}
