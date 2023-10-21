import type {
  Repo,
  TRepoContent,
  TDefGobletConfig,
  TRepoMountStatus,
  TFeatureFileModelList,
  TDefinitionFileModelList,
} from '@GRP/types'

import { Logger } from '@gobletqa/logger'
import { omitKeys } from '@keg-hub/jsutils/omitKeys'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { loadFeatures } from '@gobletqa/shared/libs/features/features'
import { buildFileTree } from '@gobletqa/shared/libs/fileSys/fileTree'
import { loadDefinitions } from '@gobletqa/shared/libs/definitions/definitions'
import { fileModelArrayToObj } from '@gobletqa/shared/models/fileModelArrayToObj'

/**
 * Loads all the needed content for a repo
 * Includes the fileTree, features and step definitions
 *
 */
export const loadRepoContent = async (
  repo:Repo,
  status:TRepoMountStatus
) => {
  try {
    const { parkin, world, ...repoData } = repo

    const content:Partial<TRepoContent> = {
      status,
      repo: {
        ...pickKeys<Repo>(repo, [`fileTypes`, `environment`, `name`, `git`, `paths`]),
        world: omitKeys(world, [`secrets`])
      } as Repo
    }

    content.fileTree = await buildFileTree(repo)
    const definitions = await loadDefinitions(repo)

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
