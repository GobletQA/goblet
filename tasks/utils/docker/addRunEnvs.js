const { loadScript } = require('../helpers/loadScript')

/**
 * Converts all the envs to docker cli format so they are passed on to the docker container
 * @param {Object} envs - All envs loaded from the `container/values.yml` file
 *
 * @returns {Array<string>} - Array of envs converted to build-args for the docker build command
 */
const addRunEnvs = async (docFileCtx, currentEnvs) => {
  const { filterExistingEnvs } = await loadScript(`filterEnvs`)
  const filteredEnvs = filterExistingEnvs(docFileCtx, currentEnvs)

  return Object.entries(filteredEnvs)
    .reduce((buildArgs, [key, value]) => {
      key && value && buildArgs.push(`-e`, `${key}=${value}`)

      return buildArgs
    }, [])
}

module.exports = {
  addRunEnvs,
}
