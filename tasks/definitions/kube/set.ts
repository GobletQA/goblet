import { TTaskActionArgs, TTaskParams } from '../../types'
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
const setAct = async (args:TTaskActionArgs) => {
  const { params } = args

  const {default:config} = await import(path.join(appRoot, `configs/tasks.config.js`))
  const { environment } = config

  // Loop the possible env options and check if the context matches any of them
  // If so use the context as the environment instead on the default params.env
  const ctxFromEnv = Object.entries(environment.map)
    .reduce((acc, [name, opts]:[string, string[]]) => {
      return opts.includes(params.context) ? name : acc
    }, ``)

  ctxFromEnv && (process.env.NODE_ENV = ctxFromEnv as string)

  const { namespace, context } = getDevspaceContext({
    force: true,
    override: true,
    namespace: params.namespace,
    env: ctxFromEnv || params.env,
    // Only set kubeContext, if its not set as the env
    kubeContext: !ctxFromEnv ? params.context : undefined
  })

  return await devspace.use({ namespace, context, env: ctxFromEnv } as TTaskParams)

}

export const set = {
  name: `set`,
  action: setAct,
  alias: [`use`],
  options: {
    context: {
      env: `GB_KUBE_CONTEXT`,
      example: `--context my-context`,
      alias: [ `kubeContext`, `kube-context`, `kC`, `kc`, `ctx`],
      description: `Kubernetes context to use when creating the secret`,
    },
    namespace: {
      // Don't use the GB_KUBE_NAMESPACE env because all envs are loaded before task action is called
      // So it will load the namespace relative to the current NODE_ENV, not the context param
      env: `GB_KUBE_NS`,
      alias: [`nsp`, `ns`],
      example: `--namespace custom-namespace`,
      description: `Custom namespace to use`,
    },
    log: {
      alias: [`lg`],
      default: true,
      example: `--no-log`,
      description: `Verbose logging of task actions`
    }
  }
}
