import type { TTask } from '../../types'

import { Logger, error } from '@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { kubectl } from '../../utils/kubectl/kubectl'

const validateParams = (params:Record<any, any>, envs:Record<any, any>) => {
  const {
    file,
    namespace=envs?.GB_KUBE_NAMESPACE,
  } = params
  
  !file
    && !namespace
    && error.throwError(`A namespace "--namespace" or file path "--file" is required.`)

  return {...params, namespace} as Record<any, any>
}


/**
 * Creates a kubernetes namespace
 * Does not seem to be supported via devspace.yaml config file
 * Using the `upgrade` command should allow this it to be idempotent
 * The helm executable is required for the command to work properly
 *
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 * @example
 * // Runs one of the following shell commands
 * kubectl create namespace my-namespace
 * kubectl create -f path/to/my/namespace.yaml
 *
 */
const namespaceAct = async ({ params }:{params:Record<any, any>}) => {
  const envs = loadEnvs({ env: params.env })
  const { namespace, apiVersion, file, clean, context, ...cmdParams } = validateParams(params, envs)
  
  const fromTemplate = Boolean(!file && namespace)
  const createArgs = fromTemplate ? [ `namespace`, namespace ] : [ `-f`, file]

  const resp = await kubectl.create(createArgs, { ...cmdParams, exec: true })

  cmdParams.log && Logger.success(`Create namespace task succeeded.`)

  return resp
}

export const namespace:TTask = {
  name: 'namespace',
  action: namespaceAct,
  alias: [ `nsp`, `ns`],
  options: {
    namespace: {
      alias: [`nsp`, `ns`],
      example: `--namespace my-namespace`,
      description: `Ingress to install with helm`,
    },
    context: {
      alias: [`ctx`],
      env: `GB_KUBE_CONTEXT`,
      example: `--context custom-kube-context`,
      description: `Custom kube-context to use. Uses the GB_KUBE_CONTEXT env when not set`,
    },
    apiVersion: {
      alias: [`version`],
      example: `--apiVersion v2`,
      description: `Override the default namespace API version`,
    },
    file: {
      alias: [`fl`],
      example: `--file /relative/path/to/namespace/file`,
      description: `Path to a file that contains the a kubernetes namespace config`,
    },
    log: {
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
    clean: {
      default: true,
      type: `boolean`,
      description: `Log the devspace command to be run`,
    },
  }
}
