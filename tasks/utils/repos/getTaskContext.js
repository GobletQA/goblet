const { noOpObj } = require('@keg-hub/jsutils')
const { getGitModified } = require('../git/getGitModified')
const { getRepoNames } = require('./getRepoNames')

/**
 * Get the sub-repos based on the provided context
 *
 * @type {function}
 * @param {string} context
 * @param {Object} params
 * @returns {Promise<array>}
 */
const getTaskContext = async (params = noOpObj) => {
  return params.context === 'all' ? getRepoNames() : await getGitModified(params)
}

module.exports = {
  getTaskContext,
}
