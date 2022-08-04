const path = require('path')
const homeDir = require('os').homedir()
const { exists } = require('@keg-hub/jsutils')
const { repos, appRoot } = require('../../paths')
const { fileSys } = require('@keg-hub/cli-utils')

const NPM_RC_FILE = `.npmrc`
const AUTH_TOKEN_REF = `_authToken=`
const NPM_TOKEN_STR = `NPM_TOKEN`

const { readFileSync } = fileSys

/**
 * Loads the content of the passed on location
 * Then tries to parse the npm token form the content
 * @param {string} location - Path to an .npmrc file
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
const loadNpmRC = (location) => {
  try {
    const content = readFileSync(location)

    return (
      content &&
      content.split('\n').reduce((found, line) => {
        // If already found, or not the correct line, just return
        if (found || !line.includes(AUTH_TOKEN_REF)) return found
        // Parse the token from the line
        const token = line.split(AUTH_TOKEN_REF).pop().trim()

        // If a token is found, then return it
        return !token.includes(NPM_TOKEN_STR) ? token : found
      }, false)
    )
  }
  catch (err) {
    return false
  }
}

/**
 * Loops over the passed in locations build a path to the locations .npmrc file
 * It then tries to load and parse the NPM_TOKEN from the file by calling loadNpmRC
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
const loopFindNpmRcFile = (locations) => {
  return locations.reduce((found, location) => {
    return found || loadNpmRC(path.join(location, NPM_RC_FILE))
  }, false)
}

/**
 * Checks the canvas-app and the home directory for the .npmrc file
 * Parses the the token from the .npmrc file if it's a real token
 *
 * @returns {string|boolean} - Found NPM Token or false
 */
const getNpmToken = () => {
  const { NPM_TOKEN, GIT_TOKEN } = process.env

  if (exists(NPM_TOKEN)) return NPM_TOKEN

  let foundToken
  exists(GIT_TOKEN) && (foundToken = GIT_TOKEN)

  // Try to load the token from the canvar or home directory
  foundToken =
    foundToken || loopFindNpmRcFile([...Object.values(repos), homeDir, appRoot])

  // If the token is found, then add it to the current process
  foundToken && (process.env.NPM_TOKEN = foundToken)

  return foundToken
}

module.exports = {
  getNpmToken,
}
