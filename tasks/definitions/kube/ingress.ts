import { helm } from '../../utils/helm/helm'
import { loadEnvs } from '../../utils/envs/loadEnvs'

  // helm upgrade --install ingress-nginx ingress-nginx \
  // --repo https://kubernetes.github.io/ingress-nginx \
  // --namespace gb-local --create-namespace

/**
 * Creates an nginx ingress on the same name-space as the goblet pods
 * Does not seem to be supported via devspace.yaml config file
 * Using the `upgrade` command should allow this it to be idempotent
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {Object} args.params - Passed in options, converted into an object
 */
const ingressAct = async ({ params }) => {
  const {} = params
  
  
}

export const ingress = {
  name: 'ingress',
  action: ingressAct,
  alias: [ `ing`, `in`],
  options: {
    
  }
}
