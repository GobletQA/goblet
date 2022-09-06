// const { appRoot } = require('../../paths')
const { loadEnvs } = require('../envs/loadEnvs')
const { ensureArr, flatUnion } = require('@keg-hub/jsutils')
const { resolveLocalPath } = require('../helpers/resolveLocalPath')
const { getContextValue, getVolumeContext } = require('../helpers/contexts')

/**
 * Merges the passed in param volumes with the env defined volumes 
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array<string>} - Array of volumes strings
 */
const resolveVols = ({ volumes, mount, env }, docFileCtx) => {
  const envs = loadEnvs({ env })
  const mountLoc = mount && getContextValue(docFileCtx, envs, `MOUNT_PATH`)

  return flatUnion([
    mountLoc,
    ...ensureArr(volumes),
    ...getVolumeContext(docFileCtx, env, ``).split(`,`)
  ])
}

/**
 * Converts the local part of a volume string to an absolute path when needed
 * @param {string} vol - The volume string to check
 *
 * @returns {string} - Updated volume string
 */
const checkLocalPath = (vol) => {
  const [local, ...rest] = vol.split(`:`)

  const source = resolveLocalPath(local)

  return `${source}:${rest.join(`:`)}`
}

/**
 * Converts passed in volume params to docker api format
 * @param {Object} params - Parsed options passed to the run task
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array<string>} - Array of volumes string in docker api format
 */
const addRunVolumes = (params, docFileCtx) => {
  const vols = resolveVols(params, docFileCtx)

  return vols.reduce((acc, vol) => {
    if(!vol) return acc
    
    !vol.includes(`:`)
      ? acc.push(`-v`, `${vol}:${vol}`)
      : acc.push(`-v`, checkLocalPath(vol))

    return acc
  }, [])
}

module.exports = {
  addRunVolumes,
}
