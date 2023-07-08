import type { Repo } from '@GSH/repo/repo'
import type {
  TRepo,
  TRootPaths,
  TRepoContent,
  TDefGobletConfig,
  TRepoMountStatus,
  TFeatureFileModelList,
  TDefinitionFileModelList,
} from '@GSH/types'

import { Logger } from '@GSH/libs/logger'
import { pickKeys, omitKeys } from '@keg-hub/jsutils'
import { loadFeatures } from '@GSH/libs/features/features'
import { buildFileTree } from '@GSH/libs/fileSys/fileTree'
import { loadDefinitions } from '@GSH/libs/definitions/definitions'
import { fileModelArrayToObj } from '@GSH/utils/fileModelArrayToObj'

/**
 * Loads all the needed content for a repo
 * Includes the fileTree, features and step definitions
 *
 */
export const loadRepoContent = async (
  repo:Repo,
  config:TDefGobletConfig,
  status:TRepoMountStatus
) => {
  try {
    const { parkin, world, ...repoData } = repo

    const content:Partial<TRepoContent> = {
      status,
      repo: {
        ...pickKeys<TRepo>(repo, [`fileTypes`, `environment`, `name`, `git`, `paths`]),
        world: omitKeys(world, [`secrets`])
      } as TRepo
    }

    content.fileTree = await buildFileTree(repo)
    const definitions = await loadDefinitions(repo, config)

    const features = await loadFeatures(repo)
    content.features = fileModelArrayToObj<TFeatureFileModelList>(features)
    content.definitions = fileModelArrayToObj<TDefinitionFileModelList>(definitions)

    return content as TRepoContent
  }
  catch(err){
    Logger.warn(`[Repo Content Error] Could not load repo content files...`)
    Logger.error(err)
    throw err
  }
}
