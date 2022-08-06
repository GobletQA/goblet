const { homeDir, appRoot } = require('../../paths')
const { ensureArr, flatUnion } = require('@keg-hub/jsutils')
const { resolveContext } = require('../kubectl/resolveContext')

/**
 * Merges the passed in param volumes with the env defined volumes 
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array<string>} - Array of volumes strings
 */
const resolveVols = ({ volumes }, envs, docFileCtx) => {
  return flatUnion([
    ...ensureArr(volumes),
    ...resolveContext(
      docFileCtx,
      {
        fe: envs.GB_FE_DOC_VOLUMES,
        be: envs.GB_BE_DOC_VOLUMES,
        cd: envs.GB_CD_DOC_VOLUMES,
        sc: envs.GB_SC_DOC_VOLUMES,
        px: envs.GB_PX_DOC_VOLUMES,
        db: envs.GB_DB_DOC_VOLUMES,
      },
      ``
    ).split(`,`)
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

  const source = local.startsWith(`~`)
    ? local.replace(`~`, homeDir) 
    : local.startsWith(`./`)
      ? local.replace(`./`, `${appRoot}/`)
      : local

  return `${source}:${rest.join(`:`)}`
}

/**
 * Converts passed in volume params to docker api format
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array<string>} - Array of volumes string in docker api format
 */
const addRunVolumes = (params, envs, docFileCtx) => {
  const vols = resolveVols(params, envs, docFileCtx)

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
