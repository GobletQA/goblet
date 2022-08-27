import path from 'path'
import { scriptsDir } from '../../paths'
import { Logger, error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getNpmToken } from '../../utils/envs/getNpmToken'

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
const authAct = async (args) => {
  const { params, tasks } = args
  const secretTask = tasks?.kube?.tasks?.secret
  !secretTask &&
    error.throwError(`The "kube.tasks.secret" task can not be found. Ensure it exists before running this command`)

  const { getDockerUser } = await import(path.join(scriptsDir, 'js/dockerLogin.js'))

  const { token:pToken, user:pUser, ...secParams } = params

  // Get the user name in the same way docker and devspace do
  const envs = loadEnvs({ env: params.env })
  const user =  pUser || await getDockerUser(envs)
  params.log && Logger.pair(`Found value for secret user`, user)

  // Get the auth token in the same way docker and devspace do
  const token = pToken || getNpmToken()
  const hidden = `${token.slice(0, 2 - token.length)}${token.slice(2, token.length).split('').map(() => '*').join('')}` 
  params.log && Logger.pair(`Found value for secret token`, hidden)

  await secretTask.action({
    ...args,
    params: {
      ...secParams,
      name: `docker-auth`,
      secrets: `user:${user},password:${token}`
    }
  })
}

export const auth = {
  name: 'auth',
  action: authAct,
  example: 'yarn task kube secrets auth <options>',
  description: 'Calls the kubectl create secrets command with the docker-authentication',
  options: {
    token: {
      alias: ['tok'],
      example: '--token ****',
      description: `Custom login token for the active git user, defaults to resolved NPM token`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the task output`,
    },
  },
}
