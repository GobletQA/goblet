import { cert } from './cert'
import { helm } from '../../utils/helm/helm'


/**
 * Removes the ingress using the helm uninstall commend
 * @example
 * `helm install ingress-nginx ingress-nginx --repo <repo> --install --namespace <current-namespace>`
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
 * Removes the ingress using the helm uninstall commend
 * @example
 * `helm uninstall ingress-nginx --namespace <current-namespace>`
 */
const cleanIngress = async (params:Record<any, any>) => {
  const { name } = params
  return await helm.uninstall([params.name], params)
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

  const { certs, clean } = params as Record<any, any>
  return clean
    ? await cleanIngress(params)
    : await createIngress(params)
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
      description: `Name of the ingress`,
    },
    ingress: {
      alias: [`ing`, `in`],
      default: `ingress-nginx`,
      example: `--ingress my-ingress`,
      description: `Ingress to install with helm`,
    },
    repo: {
      example: `--repo custom-repo-url`,
      default: `https://kubernetes.github.io/ingress-nginx`,
      alias: [`rp`, `url`, `uri`, `path`, `locaction`, `loc`],
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
      description: `Remove the ingress from the namespace`,
    },
    log: {
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
