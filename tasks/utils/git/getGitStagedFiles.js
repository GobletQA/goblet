const { git, cleanResult } = require('./git')

/**
 * Gets a list of all files the have git tracked changes
 * If a compare list is passed, then the difference it and the current is returned
 * @function
 * @public
 * @param {string} [params.compare=main] - Branch to compare against. Defaults to main
 * @param {boolean} [params.log=false] - Should the output be logged
 *
 * @returns {Array} - File paths that have git tracked changes
 */
const getGitStagedFiles = async (compare) => {
  const output = await git([`diff`, `--name-only`, `--cached`])
  return cleanResult(output, compare)
}

module.exports = {
  getGitStagedFiles,
}
