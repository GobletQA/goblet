/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Run command below to test
 * `node container/scripts/ds/resolveDSEnvs.js certs provider-auth:api-key:LINODE_V4_API_KEY`
 */
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const { filterEnvsAsYaml, addEnv } = require('./filterEnvs')
const { buildEnvSecrets } = require('./buildEnvSecrets')
const ePreFix = getEnvPrefix()

;(async () => {
  const [repo, ...fromSecrets] = process.argv.slice(2)

  let dsEnvs = [
    addEnv(`${ePreFix}SUB_REPO`, repo).trimStart(),
    addEnv(`${ePreFix}VNC_ACTIVE`, `"true"`),
  ].join(``)

  dsEnvs+= filterEnvsAsYaml(repo, envs)

  /**
  * If Kubernetes secrets are passed
  * Then generate the envs for them using `valueFrom: secretKeyRef:` syntax
  */
  fromSecrets.length && (dsEnvs+= buildEnvSecrets(fromSecrets))

  process.stdout.write(dsEnvs)

})()
