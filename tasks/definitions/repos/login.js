const path = require('path')
const { scriptsDir } = require('../../paths')
const { getNpmToken } = require('../../utils/envs/getNpmToken')
const { dockerLogin } = require(path.join(scriptsDir, 'js/dockerLogin'))

/**
 * Runs a group of tasks on the sub-repos of Goblet-Application
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const login = async (args) => {
  await dockerLogin(getNpmToken(), args.params.provider)
}

module.exports = {
  login: {
    name: 'login',
    alias: ['lg'],
    action: login,
    example: 'yarn dev login',
    description: 'Login into docker',
    options: {
      provider: {
        alias: ['context'],
        description: 'Url of the docker registry provider to login to',
        example: '--provider ghcr.io',
        default: 'ghcr.io',
      },
    },
  },
}
