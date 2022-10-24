const { Logger } = require('@keg-hub/cli-utils')
const { loadFeatures } = require('@GSH/libs/features/features')
const { buildFileTree } = require('@GSH/libs/fileSys/fileTree')
const { definitionsByType } = require('@GSH/utils/definitionsByType')
const { loadDefinitions } = require('@GSH/libs/definitions/definitions')
const { fileModelArrayToObj } = require('@GSH/utils/fileModelArrayToObj')

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
const loadRepoContent = async (repo, config, status) => {
  try {
    const content = { repo, status }
    content.fileTree = await buildFileTree(repo)
    const definitions = await loadDefinitions(repo, config)
    content.definitionTypes = definitionsByType(definitions)

    const features = await loadFeatures(repo, content.definitionTypes)
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

module.exports = {
  loadRepoContent,
}
