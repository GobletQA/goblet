const fs = require('fs')
const path = require('path')
const { containerDir } = require('../../paths')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Removes the devspace cache directory if it exists at `container/.devspace`
 *
 * @return {Promise<Boolean|Error>} - Promise resolves to true if directory is removed
 */
const removeCacheDir = ({ log }) => {
  return new Promise((res, rej) => {
    log && Logger.info(`\nRemoving devspace cache folder...`)
    fs.rmSync(path.join(containerDir, '.devspace'), { recursive: true, force: true })
    res(true)
  })
}

module.exports = {
  removeCacheDir,
}
