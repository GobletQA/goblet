import type { TRepo, TDefinitionFileModel } from '@GSH/types'

import { glob } from 'glob'
import { Logger } from '@GSH/libs/logger'
import { getPathFromBase } from '@gobletqa/goblet'
import { DefinitionsParser } from './definitionsParser'
import { GlobOnlyFiles, GlobJSFiles } from '@gobletqa/environment/constants'

/**
 * Cache holder for internal goblet definitions, so they don't have to be reloaded each time
 */
let __CachedGobletDefs:TDefinitionFileModel[]

/**
 * Builds the definitions models from the loaded definitions
 */
const parseRepoFiles = async (
  repo:TRepo,
  supportFiles:string[],
  overrideParkin:(...args:any) => any,
) => {
  return supportFiles.reduce(async (toResolve, file) => {
    const loaded = await toResolve
    if (!file) return loaded

    const { fileModel } = await DefinitionsParser.parseFile(file, repo, overrideParkin)
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
 * Loads repo specific step definitions
 * **IMPORTANT** - These should be loaded from the `repo.paths.supportDir`
 * The `gobletConfig.paths.supportDir` should **NOT** be used
 * Because tt is not the path mounted repos step definitions
 *
 */
const loadRepFiles = async (
  repo:TRepo,
  overrideParkin:(...args:any) => any,
) => {

  const { supportDir } = repo.paths
  if(!supportDir) return []

  const supportFiles = await glob(GlobJSFiles, {
    ...GlobOnlyFiles,
    cwd: getPathFromBase(supportDir, repo)
  })

  return await parseRepoFiles(repo, supportFiles, overrideParkin) || []
}


export const getSupportFiles = async (
  repo:TRepo,
  overrideParkin:(...args:any) => any,
) => {
  try {
    const support = await loadRepFiles(repo, overrideParkin)

    return {
      support
    }
  }
  catch(err){
    Logger.warn(`[Repo Support ERROR] Error loading repo support file`)
    Logger.error(err.stack)
    Logger.empty()

    return { support: [] }
  }
}
