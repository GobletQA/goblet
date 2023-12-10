require('../../../configs/aliases')

const { loadEnvs } = require('../../shared/src/utils/loadEnvs')

const nodeEnv = process.env.NODE_ENV || `local`
const envs = loadEnvs({
  name: `goblet`,
  force: true,
  locations: [],
  override: nodeEnv === 'local'
})

process.stdout.write(`${envs.GB_DT_SERVER_PORT || 8000}`)