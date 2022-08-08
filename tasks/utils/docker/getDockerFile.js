const path = require('path')
const { containerDir } = require('../../paths')
const { getContext } = require('..//helpers/contexts')

/**
 * Gets the Dockerfile to use based on the passed in docFileCtx
 * @param {string} docFileCtx - Context of the Dockerfile to use
 *
 * @returns {Array<string>} - Dockerfile path args to set the correct dockerfile
 */
const getDockerFile = (docFileCtx) => {
  // Edge case handling for app because Dockerfile has no postfix
  const postFix = getContext(docFileCtx)?.long === `app` ? `` : docFileCtx

  return [
    `-f`,
    path.join(containerDir, postFix ? `Dockerfile.${postFix}` : `Dockerfile`),
  ]
}

module.exports = {
  getDockerFile,
}
