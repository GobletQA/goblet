const { loadEnvs } = require('../envs/loadEnvs')

/**
 * Gets the all deployment options
 * @param {Object} envs - All envs parsed from the value files for the current environment
 * @return {Array} - All allow apps that can be deployed as object and array
 */
const getDeploymentOpts = (env, envs) => {
  envs = envs || loadEnvs(env)

  const deployObj = {
    be: envs.GB_BE_DEPLOYMENT,
    fe: envs.GB_FE_DEPLOYMENT,
    cd: envs.GB_CD_DEPLOYMENT,
    sc: envs.GB_SC_DEPLOYMENT,
    db: envs.GB_DB_DEPLOYMENT,
    px: envs.GB_PX_DEPLOYMENT,
  }

  const activeMap = {
    [envs.GB_BE_DEPLOYMENT]: `GB_BE_ACTIVE`,
    [envs.GB_FE_DEPLOYMENT]: `GB_FE_ACTIVE`,
    [envs.GB_CD_DEPLOYMENT]: `GB_CD_ACTIVE`,
    [envs.GB_SC_DEPLOYMENT]: `GB_SC_ACTIVE`,
    [envs.GB_DB_DEPLOYMENT]: `GB_DB_ACTIVE`,
    [envs.GB_PX_DEPLOYMENT]: `GB_PX_ACTIVE`,
  }

  return [deployObj, Object.values(deployObj), activeMap]
}

module.exports = {
  getDeploymentOpts,
}
