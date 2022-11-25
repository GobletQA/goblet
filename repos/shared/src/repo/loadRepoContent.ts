import type { TGobletConfig } from '@GSH/types'
import type { Repo } from '@GSH/repo/repo'

import { Logger } from '@keg-hub/cli-utils'
import { loadFeatures } from '@GSH/libs/features/features'
import { buildFileTree } from '@GSH/libs/fileSys/fileTree'
import { definitionsByType } from '@GSH/utils/definitionsByType'
import { loadDefinitions } from '@GSH/libs/definitions/definitions'
import { fileModelArrayToObj } from '@GSH/utils/fileModelArrayToObj'

/**
 * Loads all the needed content for a repo
 * Includes the fileTree, features and step definitions
 *
 * @param {Object} repo - Repo Class Instance
 * @param {Object} config - Goblet config object for the repo class instance
 * @param {Object} [status] - status response object from the statusGoblet workflow
 *
 * @returns {Object} - Repo file content object
 */
export const loadRepoContent = async (
  repo:Repo,
  config:TGobletConfig,
  status:Record<string, any>
) => {
  try {
    const { parkin, world, ...repoData } = repo
    const content = {
      status,
      repo: { ...repoData, world: { ...world, secrets: {} }},
    } as any
    content.fileTree = await buildFileTree(repo)
    const definitions = await loadDefinitions(repo, config)
    content.definitionTypes = definitionsByType(definitions)

    const features = await loadFeatures(repo)
    content.features = fileModelArrayToObj(features)
    content.definitions = fileModelArrayToObj(definitions)

    return content
  }
  catch(err){
    Logger.warn(`[Repo Content Error] Could not load repo content files...`)
    Logger.error(err)
    throw err
  }
}
