const { git, cleanResult } = require('./git')
const { noOpObj } = require('@keg-hub/jsutils')
const { repos, appRoot } = require('../../paths')
const { contextInLocation } = require('../repos/contextInLocation')

/**
 * Maps the repos full paths to sub paths including only the parent folder
 * @type {Array}
 */
const subRepos = repos.map((location) => {
  const split = location.split('/')
  return `${split.slice(-2).join('/')}`
})

/**
 * Uses the changed file paths to determine which repos have changed files
 * @function
 * @public
 * @param {Array<string>} fileList - List of changed files
 * @param {string} context - Name or names of repo to check for changes
 * @param {boolean} withRoot - If true, the app root will be included in the repo paths that are looped
 *
 * @returns {Array<string>} - Folder names of changes repos
 */
const getReposFromFiles = (fileList, context, withRoot) => {
  return fileList.reduce((changedRepos, line) => {
    let match = subRepos.find((subRepo) => line.includes(subRepo))

    match = match || (withRoot && appRoot)

    if (!match) return changedRepos

    contextInLocation(context, line, match) &&
      !changedRepos.includes(match) &&
      changedRepos.push(match)

    return changedRepos
  }, [])
}

/**
 * Gets the repos that have been modified relative to the compare branch
 * @function
 * @public
 * @param {Object} params - Properties to define how the git changes are found
 * @param {string} params.context - Name or names of repo to check for changes
 * @param {string} [params.compare=main] - Branch to compare against. Defaults to main
 * @param {boolean} [params.log=false] - Should the output be logged
 *
 * @returns {Array} - Repo folder names that have git tracked changes
 */
const getGitModified = async (params = noOpObj) => {
  const { context, withRoot, compare = `main` } = params

  // If context is explicitly set and it's not set to modified
  // Then we don't care about changed repos to just return
  if (context && context !== 'modified') return context === 'root' ? [appRoot] : [context]

  // run git fetch if in CI context
  process.env['CI'] == 'true' && process.env['GITHUB_ACTION'] && (await git([`fetch`]))

  // check against last commit instead of `compare` branch if condition met
  const diffCompare = compare !== 'head' ? `origin/${compare}` : `HEAD~1 HEAD`
  const output = await git([`diff`, `--name-only`, diffCompare])
  const data = cleanResult(output)

  return getReposFromFiles(data, context, withRoot)
}

module.exports = {
  getGitModified,
}
