const { command } = require('../process/command')
const { kubectl } = require('../kubectl/kubectl')
const { getCmdOptions } = require('./getCmdOptions')
const { getConfigPath } = require('./getConfigPath')
const { getDeployments } = require('./getDeployments')
const { getLabelSelector } = require('./getLabelSelector')
const { getDevspaceContext } = require('./getDevspaceContext')
const { get, ensureArr, noOpObj } = require('@keg-hub/jsutils')

/**
 * Finds the index of the last argument with a --, and appends the default devspace arguments
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Array<string>} - Updated cmd arguments with the defaults added
 */
const addDefaultArgs = async (cmd, params) => {
  const contextArgs = await getDevspaceContext(params)

  /**
   * Ensure the cmd is an array, and find the last argument with a `-`
   * Then use that index as the location to add the default arguments
   */
  let insertIdx
  const cmdArr = ensureArr(cmd).map((item, idx) => {
    insertIdx = item.startsWith(`-`) ? idx : insertIdx
    return item
  })

  insertIdx = insertIdx || cmdArr.length

  const defArgs = [
    `--config`,
    getConfigPath(params),
  ]

  const profile = params.profile || params.env
  profile && defArgs.push(`--profile`, profile)

  /** Add the default arguments at the found insertIdx */
  cmdArr.splice(insertIdx, 0, ...contextArgs, ...defArgs)

  return cmdArr
}

/**
 * Runs a devspace command and returns the output
 * Exits the process if the devspace command throws an error
 * @function
 * @public
 * @param {string|Array<string>} cmd - Devspace command to run split as an array
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Void}
 */
const devspaceCmd = command('devspace')

const devspace = async (cmd, params = noOpObj) => {
  const cmdArgs = await addDefaultArgs(cmd, params)

  return await devspaceCmd(cmdArgs, params)
}

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.deploy = async (params = noOpObj) => {
  const { skip, force, ...cmdParams } = params
  const cmdArgs = []

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(cmdParams.context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)
  force && cmdArgs.push(`--force-deploy`)

  await devspace([`deploy`, ...cmdArgs], cmdParams)
}

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.enter = async (params = noOpObj) => {
  const cmdArgs = [`enter`]
  const { selector, args } = getLabelSelector(params)

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}

/**
 * Runs the devspace cleanup images command, to remove unused images
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.cleanImgs = async (params = noOpObj) => (await devspace([`cleanup`, `images`], params))

/**
 * Runs the devspace logs command, passing in the context as the --image-selector
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.logs = async (params = noOpObj) => {
  const { follow } = params

  const cmdArgs = [`logs`]
  follow && cmdArgs.push(`--follow`)

  const { selector, args } = getLabelSelector(params)
  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}


/**
 * Runs the devspace purge command
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.purge = async (params = noOpObj) => {
  const { skip, ...cmdParams } = params

  const cmdArgs = []
  params.dependencies && cmdArgs.push(`--all`)

  /**
   * Check the context and skip arrays for which apps to deploy
   */
  const deployments = getDeployments(cmdParams.context, skip, params.env)
  deployments && cmdArgs.push(`--deployments`, deployments)

  return await devspace([`purge`, ...cmdArgs], cmdParams)
}

/**
 * Runs the devspace run command, passing in the command name as an argument
 * @param {Object} params - Passed in options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.run = async (params = noOpObj) => (await devspace([`run`, params.cmd], params))

/**
 * Checks if devspace is already running, by checking in the pod already exists and is in a Running phase
 * @param {Object} params - Passed in options, converted into an object
 *
 * @return {boolean} - True if the pod is running
 */
devspace.running = async (params = noOpObj) => {
  const [__, namespace, ___, context] = getDevspaceContext(params)
  await devspace.use({ namespace, context })

  const pod = await kubectl.getPod({ ...params, context: 'app' })

  return get(pod, `status.phase`) === `Running` ? pod : false
}

/**
 * Runs the devspace start command
 * @param {Object} params - Passed in options, converted into an object
 * @param {Object} daemonOpts - Options for starting devspace as a background daemon
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.start = async (params = noOpObj, daemonOpts = noOpObj) => {
  const cmdArgs = getCmdOptions(params, {
    build: '-b',
    debug: `--debug`,
  }, ['deployments'])

  /**
   * Check if devspace is already running
   * If it is, and build is not set, then skip the deploy process
   * And only setup the port-forwarding and file syncing
   */
  const isRunning = await devspace.running(params)
  isRunning && !params.build && cmdArgs.push(`--skip-pipeline`)

  // Add the daemon back the the params for the devspace dev command
  return await devspace([`dev`, ...cmdArgs], { ...params, ...daemonOpts })
}

/**
 * Runs the sync script to sync local and container files
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.sync = async (params = noOpObj) => {
  const { selector, args } = getLabelSelector(params)

  const { local, container } = params
  const cmdArgs = [`sync`, `--local-path=${local}`, `--container-path=${container}`]

  selector && cmdArgs.push(...args)

  return await devspace(cmdArgs, params)
}

/**
 * Runs devspace use command passing in the configured namespace and kube-context
 * @param {Object} params - Passed in task options, converted into an object
 *
 * @returns {Promise<*>} - Response from the devspace command
 */
devspace.use = async (params) => {
  const { namespace, context } = params
  context && await devspace([`use`, `context`, context], params)
  namespace && await devspace([`use`, `namespace`, namespace], params)
}

module.exports = {
  devspace,
}
