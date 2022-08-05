const { loadDefinitions } = require('@Definitions/definitions')
const { definitionsByType } = require('@Utils/definitionsByType')

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