import { helm } from '../../utils/helm/helm'
import { Logger } from '@keg-hub/cli-utils'


/**
 * Create the ingress using the helm upgrade commend
 * @example
 * `helm upgrade ingress-nginx ingress-nginx --repo <repo> --install --create-namespace`
 */
const createIngress = async (params:Record<any, any>) => {
  const { name, ingress, repo, createNamespace } = params
  const cmdArgs = [
    name,
    ingress,
    `--repo`,
    repo,
    `--install`
  ]

  createNamespace && cmdArgs.push(`--create-namespace`)

  return await helm.upgrade(cmdArgs, params)
}


/**
 * Creates an nginx ingress on the same name-space as the goblet pods
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
 * // Runs the following shell command as default
 * helm upgrade --install ingress-nginx ingress-nginx \
 * --repo https://kubernetes.github.io/ingress-nginx \
 * --namespace gb-local
 *
 */
const ingressAct = async (args:Record<any, any>) => {
  const { params } = args
  const { clean, name, remove, log } = params as Record<any, any>

  /**
  * Removes the ingress using the helm uninstall commend
  * @example
  * `helm uninstall ingress-nginx --namespace <current-namespace>`
  */
  ;(clean || remove) && await helm.uninstall([name], params)

  !remove && await createIngress(params)

  log && Logger.success(`Successfully deployed Nginx Ingress-Controller`)
}

export const ingress = {
  name: 'ingress',
  action: ingressAct,
  alias: [ `ing`, `in`],
  options: {
    name: {
      alias: [`nm`],
      default: `ingress-nginx`,
      example: `--name my-ingress`,
      description: `Name of the ingress to create in the namespace`,
    },
    ingress: {
      alias: [`ing`, `in`],
      default: `ingress-nginx`,
      example: `--ingress my-ingress`,
      description: `Name of the ngress to install with helm`,
    },
    repo: {
      example: `--repo custom-repo-url`,
      default: `https://kubernetes.github.io/ingress-nginx`,
      alias: [`rp`, `url`, `uri`, `path`],
      description: `Url or local path to the folder containing the helm chart`,
    },
    namespace: {
      alias: [`nsp`, `ns`],
      example: `--namespace custom-namespace`,
      description: `Custom namespace to use`,
    },
    createNamespace: {
      type: `boolean`,
      example: `--create`,
      alias: [ `create`, `cr`, `crn`, `cn`],
      description: `Create the namespace if it does not exist`,
    },
    clean: {
      type: `boolean`,
      example: `--clean`,
      alias: [ `cl`, `kill`, `kl`, `stop`, `stp`, `sp`, `delete`, `del`],
      description: `Remove the ingress from the namespace then redeploy it`,
    },
    remove: {
      alias: [`rm`],
      type: `boolean`,
      description: `Only remove deployed ingress resources. Do not redeploy`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
