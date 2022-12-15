/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Run command below to test
 * `node container/scripts/ds/resolveDSEnvs.js certs provider-auth:api-key:LINODE_V4_API_KEY`
 */
const { resolveValues, getEnvPrefix } = require('./resolveValues')
const { filterEnvsAsArgs, addArg } = require('./filterEnvs')
const ePreFix = getEnvPrefix()

;(async () => {
  const [repo] = process.argv.slice(2)

  let dsEnvs = [
    addArg(`${ePreFix}SUB_REPO`, repo).trimStart(),
    addArg(`${ePreFix}VNC_ACTIVE`, `true`),
  ].join(``)

  const envs = resolveValues()
  dsEnvs+= filterEnvsAsArgs(repo)

  if(repo === 'dind'){
    /**
    * Caddy uses the XDG_DATA_HOME env to save files and data
    * So we set it to the remote folder synced via devspace
    * The same /goblet/remote can be found in the container/scripts/ds/resolveSync.js file
    * The sync is setup to copy files from the dind container to the local repos/dind/goblet/remote path
    */
    
    addArg(`XDG_DATA_HOME`, envs[`${ePreFix}DD_CADDY_REMOTE_DIR`] || `/goblet/remote`)
  }

  process.stdout.write(`::set-output name=list::${dsEnvs}`)

})()
