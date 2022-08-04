const { getRepoPaths } = require('./getRepoPaths')

/**
 * Return a list of folder names from <root>/repos
 *
 * @type {function}
 * @returns {Array.<string>}
 */
const getRepoNames = () => {
  return Object.values(getRepoPaths()).map((path) => path.split('/').slice(-2).join('/'))
}

module.exports = {
  getRepoNames,
}
