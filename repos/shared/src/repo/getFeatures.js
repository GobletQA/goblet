const { loadFeatures } = require('@Features/features')
const { getDefinitions } = require('@Repo/getDefinitions')

const getFeatures = async (repo, config) => {
  const {definitions, definitionTypes} = await getDefinitions(repo, config)
  const features = await loadFeatures(repo, definitionTypes)
  
  return {
    features,
    definitions,
    definitionTypes
  }
}

module.exports = {
  getFeatures
}