/**
 * Converts all the envs to build args so they are accessible within the Dockerfile
 * @param {Object} envs - All envs loaded from the `container/values.yml` file
 *
 * @returns {Array<string>} - Array of envs converted to build-args for the docker build command
 */
const addBuildArgs = (envs, docFileCtx) => {
  if (docFileCtx === 'database' && envs.NEO4J_AUTH) {
    const [user, pass] = envs.NEO4J_AUTH.split('/')
    envs.GB_DB_USER = envs.GB_DB_USER || user
    envs.GB_DB_PASSWORD = envs.GB_DB_PASSWORD || pass
  }

  return Object.entries(envs).reduce((buildArgs, [key, value]) => {
    key && value && buildArgs.push(`--build-arg`, `${key}=${value}`)

    return buildArgs
  }, [])
}

module.exports = {
  addBuildArgs,
}
