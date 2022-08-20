/**
 * Used by devspace in the devspace.yml to dynamically load values
 * Allows loading them from the container/values*.yaml based on NODE_ENV
 */
const path = require('path')
const { resolveValues } = require('./resolveValues')
const { pickKeys, exists } = require('@keg-hub/jsutils') 
const { loadYmlSync } = require('@keg-hub/parse-config')

const defEnvs = [
  `GB_TOKEN`,
  `NODE_ENV`,
  `GB_NM_INSTALL`,
  // Add these default backend env to default so frontend knows how to connect to it
  // Need a better way to know how to load these
  `GB_BE_HOST`,
  `GB_BE_PORT`,
  `GB_VNC_ACTIVE`,
  `GB_NO_VNC_PATH`,
  `GB_VNC_VIEW_WIDTH`,
  `GB_VNC_VIEW_HEIGHT`,
  `GB_AUTH_ACTIVE`,
  `GB_BE_SOCKR_PATH`,
  `GB_BE_SOCKET_PORT`,
  `GB_BE_SOCKET_HOST`,
  `GB_PW_SOCKET_ACTIVE`,
  `GB_GITHUB_CLIENT_ID`,
  `GB_GITHUB_AUTH_USERS`,
]
const feKeys = []
const beKeys = []

const secretEnvsKeys = path.join(__dirname, `../../container/values.external.yml`)
const secretEnvs = loadYmlSync({
  error: false,
  location: secretEnvsKeys
})?.envs

if(!secretEnvs) throw new Error(`Secret Envs List could not be loaded from ${secretEnvsKeys}`)

/**
 * TODO: come up with a better way to filter frontend vs backend envs
 * Right now just filtering out firebase envs
 */
Object.keys(secretEnvs)
  .forEach(key => key.startsWith(`FIRE`) ? feKeys.push(key) : beKeys.push(key))

const addEnv = (name, value) => (`
- name: ${name}
  value: ${value}
`)

const buildEnvs = (envs, list) => {
  return Object.entries(pickKeys(envs, list))
    .reduce((acc, [name, value]) => {
      const val = process.env[name] || value
      if(!exists(val)) return acc

      acc+= addEnv(name, `"${value}"`)

      return acc
    },``)
}

const addSecret = (envName, name, key, optional) => (`
- name: ${envName}
  valueFrom:
    secretKeyRef:
      name: ${name}
      key: ${key}
      optional: ${optional}
`)

const cleanStr = (str) => {
  return str.replace(/\s|\.|-/g, `_`)
    .replace(/[^a-zA-Z ]+[^a-zA-Z0-9_]/g, ``)
    .toUpperCase()
}

const buildFromSecrets = (envs, fromSecrets) => {
  return fromSecrets.reduce((acc, secret) => {
    if(!secret) return acc

    const [name, key, optional='false'] = secret.trim().split(`:`)
    name && key
      && (acc+= addSecret(
        `${cleanStr(name)}_${cleanStr(key)}`,
        name.trim(),
        key.trim(),
        optional.trim()
      ))

    return acc
  }, ``)
}

const [repo, ...fromSecrets] = process.argv.slice(2)
let dsEnvs = addEnv(`GB_SUB_REPO`, repo)
dsEnvs += addEnv(`GB_VNC_ACTIVE`, `"true"`)
dsEnvs += addEnv(`GB_AUTH_ACTIVE`, `"true"`)

const envs = resolveValues()
dsEnvs+= buildEnvs(envs, defEnvs)
dsEnvs+= repo === `frontend` ? buildEnvs(envs, feKeys) : buildEnvs(envs, beKeys)

/**
 * If Kubernetes secrets are passed
 * Then generate the envs for them using `valueFrom: secretKeyRef:` syntax
 */
fromSecrets.length && (dsEnvs+= buildFromSecrets(envs, fromSecrets))

if(repo === `backend`){
  /**
  * Uses the kubernetes env syntax to generate the docker host from runtime envs
  * [See more here](https://kubernetes.io/docs/tasks/inject-data-application/define-interdependent-environment-variables/)
  */
  dsEnvs += addEnv(`DOCKER_HOST`, `"tcp://$(GOBLET_DIND_SERVICE_HOST):$(GOBLET_DIND_SERVICE_PORT)"`)
}
else if(repo === 'dind'){
  /**
   * Caddy uses the XDG_DATA_HOME env to save files and data
   * So we set it to the remote folder synced via devspace
   * The same /goblet/remote can be found in the scripts/js/resolveSync.js file
   * The sync is setup to copy files from the dind container to the local repos/dind/goblet/remote path
   */
  addEnv(`XDG_DATA_HOME`, envs.GB_DD_CADDY_REMOTE_DIR || `/goblet/remote`)
}


process.stdout.write(dsEnvs)
