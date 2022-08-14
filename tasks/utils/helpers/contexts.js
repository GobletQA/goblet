const { loadEnvs } = require('../envs/loadEnvs')
const { isArr, noOpObj, exists } = require('@keg-hub/jsutils')

/**
 * Cache holder for the app contexts, prefix and deployments
 */
let __PRE = ``
let __CONTEXTS = {}
let __DEPLOYMENT_OPTS

/**
 * Sets the contexts that can be used durning task execution
 * @param {Object} contexts - Contexts object with defined app contexts
 * @param {string} prefix - Prefix to append in front of each env
 */
const setContexts = (contexts, prefix) => {
  if(prefix) __PRE = prefix.endsWith(`_`) ? prefix : `${prefix}_`
  
  __CONTEXTS = isArr(contexts)
    ? contexts.reduce((acc, keys) => {
      const long = keys[0]
      const short = keys[keys.length - 1]
      // Both short and log ref the same object
      acc[short] = { keys, short, long }
      acc[long] = acc[short]

      return acc
    }, {})
    : contexts
}

/**
 * Returns a context based on the passed in name
 * @returns {Object} context - Found context object
 */
const getContext = (name) => __CONTEXTS[name]

/**
 * Returns the contexts previously set by the setContexts helper
 * @returns {Object} contexts - Contexts object with defined app contexts
 */
const getContexts = () => __CONTEXTS

/**
 * Resolves the context used to reference a kubernetes resource
 * Also checks if the context is an alias of the app or db, and returns the corresponding selector
 * @param {string} context - Passed in context option from params object
 * @param {Object} selectors - Key Value pair of selectors for each resource
 * @param {*} fallback - Fallback value to use is no context match is found
 *
 * @return {string} - Selector for referencing a kubernetes resource
 */
const resolveContext = (context = ``, selectors = noOpObj, fallback) => {
  const lowercaseContext = context.toLowerCase()
  const allContexts = getContexts()

  const found = Object.entries(allContexts).reduce((found, [ref, value]) => {
    const { keys, long, short } = allContexts[ref]

    return !found && keys.includes(lowercaseContext)
      ? selectors[short] || selectors[long]
      : found
  }, false)

  return found || (exists(fallback) ? fallback : context)
}

/**
 * Gets the all deployment options
 * @param {Object} envs - All envs parsed from the value files for the current environment
 * @return {Array} - All allow apps that can be deployed as object and array
 */
const getDeploymentOpts = (env, envs) => {
  if (__DEPLOYMENT_OPTS) return __DEPLOYMENT_OPTS

  envs = envs || loadEnvs(env)
  const allContexts = getContexts()

  const deployOpts = Object.entries(allContexts).reduce(
    (acc, [key, value]) => {
      const { long, short } = allContexts[key]

      if (long === key) return acc

      const longVal = long && envs[`${__PRE}${long.toUpperCase()}_DEPLOYMENT`]
      const shortVal = short && envs[`${__PRE}${short.toUpperCase()}_DEPLOYMENT`]
      const deployVal = longVal || shortVal
      const ref = longVal ? long : short

      if (!deployVal || !ref) return acc

      const prefix = `${__PRE}${ref.toUpperCase()}`

      acc.deployments[short] = deployVal
      acc.activeMap[deployVal] = `${prefix}_ACTIVE`
      acc.labelSelectors[ref] = `app.kubernetes.io/component=${deployVal}`

      const volEnv = `${prefix}_DOC_VOLUMES`
      envs[volEnv] && (acc.volumes[ref] = volEnv)

      return acc
    },
    {
      activeMap: {},
      deployments: {},
      labelSelectors: {},
      volumes: {}
    }
  )

  deployOpts.deployArr = Object.values(deployOpts.deployments)
  __DEPLOYMENT_OPTS = deployOpts

  return __DEPLOYMENT_OPTS
}

/**
 * Returns the long context relative to the passed in context
 * @param {string} context - Context reference
 * @param {string} fallback - Context value to use if not found
 *
 * @returns {Object} Long context name or fallback
 */
const getLongContext = (context, fallback) => {
  const contextObj = resolveContext(context, getContexts())
  return contextObj?.long || fallback
}

/**
 * Gets an env value based on the passed in context
 * @param {string} context - App context to get the value from
 * @param {Object} envs - Loaded envs from values files
 * @param {string} postFix - the post-fix of the env
 * @param {*} fallback - Value to return if the env value is not found
 *
 * @returns {*} - Found env value or fallback
 */
const getContextValue = (context, envs, postFix, fallback) => {
  const shortContext = getContext(context)?.short
  return (
    (context && envs[`${__PRE}${context.toUpperCase()}_${postFix}`]) ||
    (shortContext && envs[`${__PRE}${shortContext.toUpperCase()}_${postFix}`]) ||
    fallback
  )
}

/**
 * Returns the deploy context relative to the passed in context
 * @param {string} context - Context reference
 * @param {string} fallback - Context value to use if not found
 *
 * @returns {Object} deploy context or fallback
 */
const getDeployContext = (context, env, fallback) => {
  const { deployments } = getDeploymentOpts(env)
  return resolveContext(context, deployments, fallback)
}

/**
 * Returns the selector label context relative to the passed in context
 * @param {string} context - Context reference
 * @param {string} fallback - Context value to use if not found
 *
 * @returns {Object} selector label context or fallback
 */
const getLabelContext = (context, env, fallback) => {
  const { labelSelectors } = getDeploymentOpts(env)
  return resolveContext(context, labelSelectors, fallback)
}

/**
 * Returns the volumes context relative to the passed in context
 * @param {string} context - Context reference
 * @param {string} fallback - Context value to use if not found
 *
 * @returns {Object} volumes context or fallback
 */
const getVolumeContext = (context, env, fallback) => {
  const { volumes } = getDeploymentOpts(env)
  return resolveContext(context, volumes, fallback)
}


module.exports = {
  getContext,
  getContexts,
  setContexts,
  getLongContext,
  resolveContext,
  getLabelContext,
  getContextValue,
  getDeployContext,
  getVolumeContext,
  getDeploymentOpts,
}
