const { getContextValue } = require('../../utils/helpers/contexts')
const { ensureArr, toBool, isStr, isNum, toStr, noPropArr } = require('@keg-hub/jsutils')

/**
 * Finds the ports to bind from the localhost to a docker container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Ports to be bound
 */
const resolveAllPorts = (params, envs, docFileCtx) => {
  const paramPorts = ensureArr(params.ports || [])

  // Get the ports for the docker image being run
  const envPorts = getContextValue(docFileCtx, envs, `PORT`, [
    envs.GB_BE_PORT,
    envs.GB_FE_PORT,
    envs.GB_CD_PORT,
    envs.GB_SC_PORT,
    envs.GB_DB_PORT,
    envs.GB_PX_PORT
  ])

  return paramPorts.concat(envPorts)
}

/**
 * Checks if binding a local port to the container should be skipped
 * @param {Array} ports - Array of ports that should be bound
 *
 * @returns {Boolean} - True if ports should be bound
 */
const skipPortBind = (ports=noPropArr) => {
  return ports.map(toBool).includes(false)
}

/**
 * Gets the local ports that should be bound to the running container
 * @param {Object} params - Parsed options passed to the run task
 * @param {Object} envs - ENV values loaded from the container/value.yml files
 * @param {string} docFileCtx - Current context of the docker image to run
 *
 * @returns {Array} - Formatted port arguments to pass to the docker run cli
 */
const addRunPorts = (params, envs, docFileCtx) => {
  if(skipPortBind(params.ports)) return noPropArr

  return resolveAllPorts(params, envs, docFileCtx)
    .map(p =>  p && toStr(p))
    .reduce((acc, port) => {
      if(!port || (!isStr(port) && !isNum(port))) return acc

      port.includes(`:`) || port.includes(`/`)
        ? acc.push(`-p`, port)
        : acc.push(`-p`, `${port}:${port}`)

      return acc
    }, [])
}

module.exports = {
  addRunPorts,
}
