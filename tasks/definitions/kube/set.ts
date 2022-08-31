import path from 'path'
import { appRoot } from '../../paths'
import { devspace } from '../../utils/devspace/devspace'
import { getDevspaceContext } from '../../utils/devspace/getDevspaceContext'

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
const setAct = async (args:Record<any, any>) => {
  const { params } = args
  const {default:config} = await import(path.join(appRoot, `configs/tasks.config.js`))
  const { environment } = config

  // Loop the possible env options and check if the context matches any of them
  // If so use the context as the environment instead on the default params.env
  const ctxFromEnv = Object.entries(environment.map)
    .reduce((acc, [name, opts]:[string, string[]]) => {
      return opts.includes(params.context) ? name : acc
    }, false)

  ctxFromEnv && (process.env.NODE_ENV = ctxFromEnv as string)

  const { namespace, context } = getDevspaceContext({
    force: true,
    override: true,
    namespace: params.namespace,
    env: ctxFromEnv || params.env,
    // Only set kubeContext, if its not set as the env
    kubeContext: !ctxFromEnv ? params.context : undefined
  })

  return await devspace.use({ namespace, context })

}

export const set = {
  name: 'set',
  action: setAct,
  alias: [],
  options: {
    context: {
      env: `GB_KUBE_CONTEXT`,
      example: `--context my-context`,
      alias: [ `kubeContext`, `kube-context`, `kC`, `kc`, `ctx`],
      description: `Kubernetes context to use when creating the secret`,
    },
    namespace: {
      env: `GB_KUBE_NAMESPACE`,
      alias: [`nsp`, `ns`],
      example: `--namespace custom-namespace`,
      description: `Custom namespace to use`,
    }
  }
}
