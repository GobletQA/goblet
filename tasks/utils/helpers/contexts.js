const { loadEnvs } = require('../envs/loadEnvs')
const { noOpObj, exists, deepMerge, get, styleCase } = require('@keg-hub/jsutils')

/**
 * Cache holder for the app contexts, prefix and deployments
 */
let __PRE = ``
let __CONTEXTS = {}
let __DEPLOYMENT_OPTS


/**
 * Builds the short and long context from app config
 * @param {Object} acc - Cache object that holds the app contexts and configs
 * @param {Object} contexts - Contexts object with defined app contexts
 * @param {Object} contexts - Context config object with the configs of each app
 */
const buildContexts = (acc, contexts, data) => {
  const sorted = contexts.sort((a, b) => (b.length - a.length))
  
  const long = sorted[0]
  const short = sorted[sorted.length - 1]
  // Both short and log ref the same object
  acc[short] = { keys: sorted, short, long }
  acc[long] = acc[short]
  acc.CONTEXT_LIST.push(long)
  acc.CONTEXT_CONFIGS[long] = data

  return acc
}

/**
 * Sets the contexts that can be used durning task execution
 * @param {Object} contexts - Contexts object with defined app contexts
 * @param {string} prefix - Prefix to append in front of each env
 */
const setContexts = (apps, prefix) => {
  const { default:defApp, ...appConfigs } = apps
  prefix = prefix || defApp.prefix || `DS`

  if(prefix) __PRE = prefix.endsWith(`_`) ? prefix : `${prefix}_`

  __CONTEXTS = Object.entries(appConfigs)
    .reduce((acc, [key, data]) => {
      data = deepMerge(defApp, data || noOpObj)
      const name = data?.name || key
      const contexts = data?.contexts || []
      !contexts.includes(name) && contexts.shift(name)

      return buildContexts(acc, contexts, data)

    }, { CONTEXT_LIST: [], CONTEXT_CONFIGS: {} })

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
    if(ref === `CONTEXT_LIST` || ref === `CONTEXT_CONFIGS`) return found
    
    const { keys, long, short } = allContexts[ref]

    return !found && keys.includes(lowercaseContext)
      ? selectors[short] || selectors[long]
      : found
  }, false)

  return found || (exists(fallback) ? fallback : context)
}

/**
 * Gets the all deployment options
 */
const getDeploymentOpts = (env, envs) => {
  if (__DEPLOYMENT_OPTS) return __DEPLOYMENT_OPTS

  envs = envs || loadEnvs(env)
  const allContexts = getContexts()

  const deployOpts = Object.entries(allContexts).reduce(
    (acc, [key, value]) => {
      if(key === `CONTEXT_LIST` || key === `CONTEXT_CONFIGS`) return acc
      
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

      const volEnv = envs[`${prefix}_DOC_VOLUMES`]
      volEnv && (acc.volumes[ref] = volEnv)

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
 * @param {string} [fallback] - Context value to use if not found
 *
 * @returns {Object} Long context name or fallback
 */
const getLongContext = (context, fallback) => {
  const contextObj = resolveContext(context, getContexts())
  return contextObj?.long || fallback
}

/**
 * Gets an env value based on the passed in context
 */
const getContextValue = (context, envs, postFix, fallback) => {
  if(!context) return fallback

  const upperCtx = context.toUpperCase()
  const envCtxRef = `${__PRE}${upperCtx}_${postFix}`

  const shortContext = getContext(context)?.short
  const upperSCtx = shortContext && shortContext.toUpperCase()
  const envSCtxRef = upperSCtx && `${__PRE}${upperSCtx}_${postFix}`

  // TODO: need to merge task.config env.values with envs
  // For now, just merging envs with task.config app env.values
  // This means envs defined in task.config only work in tasks and not the app code
  // Will need to re-work the loadEnvs method to include task.config env.values
  const config = __CONTEXTS.CONTEXT_CONFIGS[context]
    || __CONTEXTS.CONTEXT_CONFIGS[shortContext]

  const taskEnvs = get(config, `envs.values`, noOpObj)

  const found = (
    // Task config envs.values are scoped so they don't have include the prefix of the app
    // So first check if it exists in the camelCase format
    // Then check for the explicitly defined ENV that matches ENVs in the values.yaml files
    // Then check the envs from the values files - Eventually the two will be merged
    // And the envs object will container them both
    taskEnvs[styleCase(postFix)]
    || taskEnvs[envCtxRef]
    || taskEnvs[envSCtxRef]
    || envs[envCtxRef]
    || (envSCtxRef && envs[envSCtxRef])
    || fallback
  )
  
  return found
}

/**
 * Returns the deploy context relative to the passed in context
 * @param {string} context - Context reference
 * @param {string} env - Context value to use if not found
 * @param {string} [fallback] - Context value to use if not found
 *
 * @returns {Object} deploy context or fallback
 */
const getDeployContext = (context, env, fallback) => {
  const { deployments } = getDeploymentOpts(env)
  return resolveContext(context, deployments, fallback)
}

/**
 * Returns the selector label context relative to the passed in context
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
  const volCtx = resolveContext(context, volumes, fallback)

  return volCtx
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
