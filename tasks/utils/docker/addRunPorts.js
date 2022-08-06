const { ensureArr, isArr, toBool, isStr } = require('@keg-hub/jsutils')
const { resolveContext } = require('../../utils/kubectl/resolveContext')

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

  // Get the context for the docker image being run
  const envPorts = ensureArr(
    resolveContext(
      docFileCtx,
      {
        fe: envs.GB_FE_PORT,
        be: envs.GB_BE_PORT,
        cd: envs.GB_CD_PORT,
        sc: envs.GB_SC_PORT,
        px: envs.GB_PX_PORT,
        db: envs.GB_DB_PORT,
      },
      [
        envs.GB_BE_PORT,
        envs.GB_FE_PORT,
        envs.GB_CD_PORT,
        envs.GB_SC_PORT,
        envs.GB_DB_PORT,
        envs.GB_PX_PORT
      ]
    )
  )

  return paramPorts.concat(envPorts)
}

/**
 * Checks if binding a local port to the container should be skipped
 * @param {Array} ports - Array of ports that should be bound
 *
 * @returns {Boolean} - True if ports should be bound
 */
const skipPortBind = (ports) => {
  return Boolean(!isArr(ports) || ports.map(toBool).includes(false))
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
  if (skipPortBind(params.ports)) return []

  return resolveAllPorts(params, envs, docFileCtx).reduce((acc, port) => {
    if(!port || !isStr(port)) return acc

    port.includes(`:`) || port.includes(`/`
      ? acc.push(`-p`, port)
      : acc.push(`-p`, `${port}:${port}`))

    return acc
  }, [])
}

module.exports = {
  addRunPorts,
}
