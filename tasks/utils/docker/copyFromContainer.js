const { docker } = require('@keg-hub/cli-utils')

/**
 * Copy content from a docker container to the host machine
 */
const copyFromContainer = async ({ local, remote, container }) => {
  await docker([`cp`, `${container}:${remote}`, local])
}

module.exports = {
  copyFromContainer
}