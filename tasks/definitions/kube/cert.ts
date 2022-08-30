import { helm } from '../../utils/helm/helm'

/**
 * Creates a kubernetes cert-manager resource
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
 *
 */
const certAct = async (args:Record<any, any>) => {
  const { params } = args

  console.log(`TODO - Not implemented!`)
}

export const cert = {
  name: 'cert',
  action: certAct,
  alias: [ `ing`, `in`],
  options: {
    context: {
      alias: [`kube-context`, `kc`, `ctx`],
      example: `--context my-context`,
      env: `GB_KUBE_CONTEXT`,
      description: `Kubernetes context to use when creating the secret`,
    },
    namespace: {
      alias: [`nsp`, `ns`],
      example: `--namespace custom-namespace`,
      description: `Custom namespace to use`,
    },
    log: {
      type: `boolean`,
      description: `Log the commands to be run`,
    },
  }
}
