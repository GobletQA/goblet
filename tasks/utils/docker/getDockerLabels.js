const path = require('path')
const { appRoot } = require('../../paths')
const packConf = require(path.join(appRoot, 'package.json'))

/**
 * Builds the labels to add to the docker image
 * @param {string} docFileCtx - Context of the Dockerfile to use
 * @param {Object} envs - ENV values loaded from the values.yml files
 *
 * @returns {Array<string>} - Build labels for the docker image
 */
const getDockerLabels = (docFileCtx, envs) => {
  return [
    `--label`,
    packConf.name,
    `--label`,
    docFileCtx === 'proxy'
      ? envs.GB_PROXY_DEPLOYMENT
      : docFileCtx === 'backend'
        ? envs.GB_BE_DEPLOYMENT
        : docFileCtx === 'frontend'
          ? envs.GB_FE_DEPLOYMENT
          : `goblet-app`,
  ]
}

module.exports = {
  getDockerLabels,
}
