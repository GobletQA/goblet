const { docker, error } = require('@keg-hub/cli-utils')

/**
 * Sets the docker buildx builder instance
 * @param {string} builder - Name of the docker buildx builder instance to use
 * @param {string} appRoot - All envs loaded from the `container/values.yml` file
 * @param {Object} allEnvs - All envs loaded from the `container/values.yml` file
 *
 * @returns {Void}
 */
const setupBuildX = async (builder, appRoot, allEnvs) => {
  // Create the buildx goblet context if it does not exist
  await docker([`buildx`, `create`, `--name`, builder], {
    cwd: appRoot,
    env: allEnvs,
    exec: true,
  })

  // Then try to use it, if we don't get an exitCode 0 response, then throw an error
  const { exitCode } = await docker([`buildx`, `use`, builder], {
    exec: true,
    cwd: appRoot,
    env: allEnvs,
  })

  exitCode &&
    error.throwError(
      `Could not switch to buildx context "goblet". Please update the context manually`
    )
}

module.exports = {
  setupBuildX,
}
