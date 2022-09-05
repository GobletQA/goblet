import path from 'path'
import { readFileSync } from 'fs'
import { appRoot } from '../../../paths'
import { Logger, error } from'@keg-hub/cli-utils'
import { resolvePath } from'@keg-hub/jsutils/node'

import { loadEnvs } from '../../../utils/envs/loadEnvs'

const getProviderToken = async (
  envs:Record<any, any>,
  name?:string,
  key?:string,
  token?:string,
  file?:string
) => {
  const tokenName = name || envs.GB_CR_PROVIDER_TOKEN_NAME
  const tokenKey = key || envs.GB_CR_PROVIDER_TOKEN_KEY
  let fileLoc = file && resolvePath(file, appRoot)
  fileLoc = fileLoc || path.resolve(envs.GB_CR_PROVIDER_TOKEN_PATH)

  return token
    ? [tokenName, tokenKey, token]
    : [tokenName, tokenKey, readFileSync(fileLoc).toString()]
}

/**
 * Log the output of a running kubernetes pod
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const providerAct = async (args) => {
  const { params, tasks } = args
  const secretTask = tasks?.kube?.tasks?.secret
  !secretTask &&
    error.throwError(`The "kube.tasks.secret" task can not be found. Ensure it exists before running this command`)

  const { token:pToken, name:pName, file, key:pKey, cert, ...secParams } = params

  // Get the user name in the same way docker and devspace do
  const envs = loadEnvs({ env: params.env })
  const namespace = params.namespace || (cert ? envs.GB_CR_NAMESPACE : envs.GB_KUBE_NAMESPACE)

  // Get the auth token in the same way docker and devspace do
  const [name, key, token] = pToken && pName
    ? [pName, pKey, pToken]
    : await getProviderToken(envs, pName, pKey, pToken, file)

  !token && error.throwError(`Provider secret token could not be found`)
  !name && !key && error.throwError(`Provider secret name ${name} or ${key} is required`)

  params.log && Logger.pair(`Found value for provider secret name`, name)

  const hidden = `${token.slice(0, 2 - token.length)}${token.slice(2, token.length).split('').map(() => '*').join('')}` 
  params.log && Logger.pair(`Found value for provider secret token`, hidden)

  return await secretTask.action({
    ...args,
    params: {
      ...secParams,
      namespace,
      value: token,
      literal: true,
      key: key || name,
      name: name || key,
    }
  })
}

export const provider = {
  name: `provider`,
  action: providerAct,
  alias: [ `pro`, `cp`, `cloud`, `clp`],
  example: `yarn task kube secrets provider <options>`,
  description: `Calls the kubectl create secrets command to create cloud provider secrets`,
  options: {
    token: {
      alias: [`tok`],
      example: `--token ****`,
      description: `Custom API token for the cloud provider`,
    },
    file: {
      alias: [`fl`],
      example: `--file /relative/path/to/secret/file`,
      description: `Path to a file that contains the secret relative to the apps root directory`,
    },
    name: {
      example: `--name my-secret-name`,
      description: `Name of the secret that stores the API token for the cloud provider`,
    },
    key: {
      alias: [`ky`],
      example: `--key secret-key-name`,
      description: `Key name of the secret, uses name when key is not already set`,
    },
    cert: {
      example: `--cert`,
      alias: [`cm`, `cert-manager`],
      description: `Use the cert-manager namespace when creating the secret`,
    },
    namespace: {
      alias: [`nsp`, `ns`],
      example: `--namespace my-namespace`,
      description: `Namespace to use when creating the secret`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the task output`,
    },
  },
}
