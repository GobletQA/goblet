const { homeDir, appRoot } = require('../../paths')

/**
 * Converts the local part of a volume string to an absolute path when needed
 * @param {string} vol - The volume string to check
 *
 * @returns {string} - Updated volume string
 */
const resolveLocalPath = (location) => {
  return location.startsWith(`~`)
    ? location.replace(`~`, homeDir) 
    : location === `.`
      ? appRoot
      : location.startsWith(`./`)
        ? location.replace(`./`, `${appRoot}/`)
        : location
}


module.exports = {
  resolveLocalPath
}