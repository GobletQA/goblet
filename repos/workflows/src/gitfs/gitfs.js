const { URL } = require('node:url')
const { runCmd } = require('@keg-hub/cli-utils')
const { throwErr } = require('../utils/throwErr')
const { isObj, limbo, deepMerge, exists } = require('@keg-hub/jsutils')

/**
 * Default child process options
 * @type {Object}
 */
const defCmdOpts = {
  exec: true
}

/**
 * Validates the gitOpts object has the correct properties
 * @function
 * @throws
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 *
 * @returns {Void}
 */
const validateGitOpts = gitOpts => {
  // Ensure an object is passed
  !isObj(gitOpts) &&
    throwErr(`GitFS requires an options object. Received ${typeof gitOpts}`)
  ;['local', 'remote', 'branch', 'username'].map(key => {
    !gitOpts[key] &&
      throwErr(
        `GitFS requires a ${key} property and value in the git options object`
      )
  })

  !gitOpts.token &&
    !exists(process.env.GOBLET_GIT_TOKEN) &&
    throwErr(
      `GitFS requires a valid token property. Or set the GOBLET_GIT_TOKEN env`
    )

  return {
    local: gitOpts.local,
    remote: gitOpts.remote,
    branch: gitOpts.branch,
    username: gitOpts.username,
    commiter_name: gitOpts.name || gitOpts.username,
    password: gitOpts.token || process.env.GOBLET_GIT_TOKEN,
    commiter_email: gitOpts.email || `${gitOpts.username}@goblet.io`,
  }
}

/**
 * Calls gitfs in a subshell after building the options from the passed in args
 * @function
 * @param {gitOpts} gitOpts - properties to build options for the gitfs call
 * @param {Object} cmdOpts - Options to pass to the child sub process
 *
 * @returns {}
 */
const gitfs = async (gitOpts, cmdOpts) => {
  const options = validateGitOpts(gitOpts)
  const { local, remote, password } = options
  const url = new URL(remote)  
  const giturl = `${url.protocol}//${password}@${url.host}${url.pathname}`

  const [err, resp] = await limbo(runCmd('git', [ `clone`, giturl], deepMerge(defCmdOpts, cmdOpts), local))
  // If repo already exists, then just reuse it
  return err
    ? [err, resp]
    : resp?.exitCode === 128 && resp?.error && resp?.error?.includes(`already exists and is not an empty directory`)
      ? [null, null]
      : [err, resp]
}

module.exports = {
  gitfs,
}
