/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Run command below to test
 * `node container/scripts/ds/resolveDSEnvs.js certs provider-auth:api-key:LINODE_V4_API_KEY`
 */
const { getEnvPrefix } = require('./resolveValues')
const { filterEnvsAsArgs, addArg } = require('./filterEnvs')
const ePreFix = getEnvPrefix()

;(async () => {
  const [repo] = process.argv.slice(2)

  let dsEnvs = [
    addArg(`${ePreFix}SUB_REPO`, repo).trimStart(),
    addArg(`${ePreFix}VNC_ACTIVE`, `true`),
  ].join(``)

  dsEnvs+= filterEnvsAsArgs(repo)

  process.stdout.write(`"{list}=${dsEnvs}" >> $GITHUB_OUTPUT`)

})()
