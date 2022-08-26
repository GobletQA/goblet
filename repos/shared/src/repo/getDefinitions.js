const { loadDefinitions } = require('@GSH/libs/definitions/definitions')
const { definitionsByType } = require('@GSH/utils/definitionsByType')

/**
 * Loads the definitions, then splits them based on their type
 */
const getDefinitions = async (repo, config) => {
  const definitions = await loadDefinitions(repo, config)
  const definitionTypes = definitionsByType(definitions)

  return {
    definitions,
    definitionTypes
  }
}

module.exports = {
  getDefinitions
}