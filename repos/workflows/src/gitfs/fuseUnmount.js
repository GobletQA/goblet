const fs = require('fs')
const { limbo } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')
const { throwErr } = require('../utils/throwErr')
const { getRepoPath } = require('../utils/getRepoPath')

/**
 * Unmounts a fuse mounted directory, then removes the directory
 * @function
 * @public
 * @throws
 *
 * @param {Object} args
 *
 * @returns {void}
 */
const fuseUnmount = async args => {
  const repoPath = getRepoPath(args)
  Logger.log(`Unmounting repo at path ${repoPath}`)

  // Remove the repo directory
  Logger.log(`Removing repo directory...`)
  const [err] = await limbo(
    new Promise((res, rej) => {
      fs.rm(repoPath, { recursive: true, force: true }, err =>
        err ? rej(err) : res(true)
      )
    })
  )

  err && throwErr(err)
}

module.exports = {
  fuseUnmount,
}
