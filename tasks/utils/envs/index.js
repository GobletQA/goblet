module.exports = {
  ...require('./getNpmToken'),
  ...require('./loadEnvs'),
  ...require('./replaceTemplateVars'),
  ...require('./setMountEnvs'),
}

