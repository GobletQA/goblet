const { repos, appRoot } = require('../../paths')
const { wordCaps, isFunc } = require('@keg-hub/jsutils')

/**
 * Helper to loop the paths of each sub-folder repo
 * Then executes the passed in callback method
 * @param {function} callback - Function to call for each repo location
 * @param {boolean} withRoot - If true, the app root will be included in the repo paths that are looped
 *
 * @returns {Array<Promise>} - Response from the callback for each repo
 */
const loopRepos = async (callback, withRoot) => {
  if (!isFunc(callback))
    throw new Error(`The loopRepos method requires a callback function`)

  // Check if the app root should be included in the loop
  const reposToLoop = withRoot ? [appRoot, ...repos] : repos

  return await reposToLoop.reduce(async (toResolve, location) => {
    const responses = await toResolve

    // Get the name of the repo being installed
    const repoName = wordCaps(location.split('/').pop())

    // Execute the callback for the repo, and store the response
    const response = await callback(repoName, location)
    response && responses.push(response)

    // Always return the response array
    return responses
  }, Promise.resolve([]))
}

module.exports = {
  loopRepos,
}
