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
]
const feKeys = []
const beKeys = []

const secretEnvsKeys = path.join(__dirname, `../../container/values.external.yml`)
const secretEnvs = loadYmlSync({
  error: false,
  location: secretEnvsKeys
})?.envs

if(!secretEnvs) throw new Error(`Secret Envs List could not be loaded from ${secretEnvsKeys}`)

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

const [repo] = process.argv.slice(2)
let dsEnvs = addEnv(`GB_SUB_REPO`, repo)
dsEnvs += addEnv(`GB_VNC_ACTIVE`, `"true"`)
dsEnvs += addEnv(`GB_AUTH_ACTIVE`, `"true"`)

// Add the docker-host env only to conductor so it can talk to the dind sidecar
repo === `conductor` && (dsEnvs += addEnv(`DOCKER_HOST`, `tcp://localhost:2375`))

const envs = resolveValues()
dsEnvs+= buildEnvs(envs, defEnvs)
dsEnvs+= repo === `frontend` ? buildEnvs(envs, feKeys) : buildEnvs(envs, beKeys)

process.stdout.write(dsEnvs)
