/**
 * Converts all the envs to docker cli format so they are passed on to the docker container
 * @param {Object} envs - All envs loaded from the `container/values.yml` file
 *
 * @returns {Array<string>} - Array of envs converted to build-args for the docker build command
 */
const addRunEnvs = (envs, docFileCtx) => {
  return Object.entries(envs).reduce((buildArgs, [key, value]) => {
    key && value && buildArgs.push(`-e`, `${key}=${value}`)

    return buildArgs
  }, [])
}

module.exports = {
  addRunEnvs,
}
