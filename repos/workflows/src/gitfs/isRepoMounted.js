const { throwErr } = require('../utils/throwErr')
const { getRepoPath } = require('../utils/getRepoPath')
const { fileSys, Logger } = require('@keg-hub/cli-utils')

/**
 * Checks if the passed in path is a fuse mount directory
 * @function
 * @public
 * @throws
 *
 * @param {Object} args
 * @param {Object} args.user - User model object
 * @param {string} args.user.gitUser - Name of the user
 * @param {string} localPath - Already known path to a repo location
 *
 * @returns {boolean} - true if the repo is mounted
 */
const isRepoMounted = async (args, localPath) => {
  const repoPath = localPath || getRepoPath(args)

  Logger.log(`Checking if repo is mounted at ${repoPath}`)
  const [err, pathExists] = await fileSys.pathExists(repoPath)
  err && err.code !== `ENOENT` && throwErr(err)

  return Boolean(pathExists)
}

module.exports = {
  isRepoMounted,
}
