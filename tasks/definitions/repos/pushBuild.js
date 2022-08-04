const { existsSync } = require('fs')
const { Logger } = require('@keg-hub/cli-utils')
const { commitGitChanges } = require('../../utils/git/commitGitChanges')
const { getRepoNames } = require('../../utils/repos/getRepoNames')

/**
 * Runs the build script for the sub-repos
 *
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const pushBuild = async (args) => {
  const { message, branch } = args.params

  const path = getRepoNames().reduce((results, repo) => {
    const distPath = `repos/${repo}/dist`
    if (existsSync(distPath)) results.push(distPath)

    return results
  }, [])

  if (path.length <= 0) {
    Logger.info("No repos found that require '/dist' to be pushed up to")
    return false
  }

  Logger.info(`Attempting to commit and push: `, JSON.stringify(path, null, 2))
  return await commitGitChanges(message, branch, path)
}

module.exports = {
  pushBuild: {
    name: 'pushBuild',
    action: pushBuild,
    example: 'yarn task pushBuild <options>',
    description: 'commits and pushes the build up',
    options: {
      context: {
        alias: ['repo'],
        description: 'Name or names of the repo to be pushed',
        example: '--context frontend',
      },
      message: {
        alias: ['msg'],
        description: 'Git commit message',
        example: '--msg add a file for testing',
      },
      branch: {
        description: 'Branch changes should be pushed too',
        example: '--branch main',
      },
    },
  },
}
