const Module = require('module')
const { GobletRoot } = sharedPaths
const { aliases } = require('@GConfigs/aliases.config')

const overrideNoOp = (request) => true
const resolveNoOp = () => ({})

/**
 * @type {Object} - List of allowed packages to be required
 * Needs more investigation on what modules should be allowed
 * So will need to update this as needed
 */
const allowedModules = [
  `@ltipton/parkin`,
  `@keg-hub/jsutils`,
  ...Object.keys(aliases),
]

/**
 * TODO: @lance-tipton Need a better way to do path validation here
 * Validates a require request can be loaded based on it's location
 * Throws an error if the request is in-valid 
 * @throws
 */
const validateRequest = (request, { repoRoot }) => {
  // Check if the original request is an allowed module
  // Use filter/startsWith to allow module sub-paths
  const isAllowedModule = allowedModules.filter(allowed => request.startsWith(allowed))
  if(isAllowedModule) return

  const isRepoRoot = request.startsWith(repoRoot)
  const isGobletRoot = request.startsWith(GobletRoot)

  // Check if the root is the regular docker container or a github action paths
  const isRootPathValid = request.startsWith('/goblet')
    || request.startsWith('/keg')
    || request.startsWith('/home/runner')
    || request.startsWith('/github/workspace')
    || request.startsWith('/github/alt')

  if(!isRepoRoot && !isGobletRoot){
    console.error(`Can not require module ${request}.\nOutside of root directory`)
    throw new Error(`Error loading module.`)
  }
  else if(!isRootPathValid) {
    console.error(`Can not require module ${request}.\nIs an absolute path or invalid module`)
    throw new Error(`Error loading module.`)
  }
}


/**
 * Overrides the default require method to allow require to return a custom module
 * Also allows validating the require request to ensure the module is allowed to be loaded
 */
const requireOverride = (repo, isOverride=overrideNoOp, resolveOverride=resolveNoOp) => {
  const originalLoad = Module._load

  Module._load = function (request, parent) {

    validateRequest(request, repo.paths)

    return isOverride(request, parent)
      ? resolveOverride(request, parent)
      : originalLoad.apply(this, arguments)

  }

  return () => {
    Module._load = originalLoad
  }
}

module.exports = {
  requireOverride
}