const path = require('path')
const { containerDir } = require('../../paths')

/**
 * Gets the Dockerfile to use based on the passed in docFileCtx
 * @param {string} docFileCtx - Context of the Dockerfile to use
 *
 * @returns {Array<string>} - Dockerfile path args to set the correct dockerfile
 */
const getDockerFile = (docFileCtx) => {
  return [
    `-f`,
    path.join(containerDir, docFileCtx ? `Dockerfile.${docFileCtx}` : `Dockerfile`),
  ]
}

module.exports = {
  getDockerFile,
}
