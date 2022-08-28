import { helm } from '../../utils/helm/helm'

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
const ingressAct = async ({ params }:{params:Record<any, any>}) => {
  const { name, ingress, repo, create } = params
  const cmdArgs = [
    name,
    ingress,
    `--repo`,
    repo,
    `--install`
  ]

  create && cmdArgs.push(`--create-namespace`)

  return await helm.upgrade(cmdArgs)
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
    create: {
      type: `boolean`,
      example: `--create`,
      alias: [`new`, `cr`],
      description: `Create the namespace if it does not exist`,
    }
  }
}
