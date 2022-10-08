/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 * Run command below to test
 * `node scripts/js/resolveDSEnvs.js certs provider-auth:api-key:LINODE_V4_API_KEY`
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

  const envs = resolveValues()
  dsEnvs+= filterEnvsAsYaml(repo)

  /**
  * If Kubernetes secrets are passed
  * Then generate the envs for them using `valueFrom: secretKeyRef:` syntax
  */
  fromSecrets.length && (dsEnvs+= buildEnvSecrets(fromSecrets))

  if(repo === `backend`){
    /**
    * Uses the kubernetes env syntax to generate the docker host from runtime envs
    * [See more here](https://kubernetes.io/docs/tasks/inject-data-application/define-interdependent-environment-variables/)
    */
    dsEnvs += addEnv(`DOCKER_HOST`, `"tcp://$(${ePreFix}DD_DEPLOYMENT):$(GOBLET_DIND_SERVICE_PORT)"`)
  }
  else if(repo === 'dind'){
    /**
    * Caddy uses the XDG_DATA_HOME env to save files and data
    * So we set it to the remote folder synced via devspace
    * The same /goblet/remote can be found in the scripts/js/resolveSync.js file
    * The sync is setup to copy files from the dind container to the local repos/dind/goblet/remote path
    */
    addEnv(`XDG_DATA_HOME`, envs[`${ePreFix}DD_CADDY_REMOTE_DIR`] || `/goblet/remote`)
  }

  process.stdout.write(dsEnvs)

})()
