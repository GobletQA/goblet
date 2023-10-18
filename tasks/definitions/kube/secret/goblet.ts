import type { TTask, TTaskActionArgs } from '../../../types'

import { Logger, error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../../utils/envs/loadEnvs'

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
const addGobletToken = async (args:TTaskActionArgs) => {
  const { params, tasks } = args
  const secretTask = tasks?.kube?.tasks?.secret
  !secretTask &&
    error.throwError(`The "kube.tasks.secret" task can not be found. Ensure it exists before running this command`)

  const { token:pToken, ...secParams } = params

  // Get the user name in the same way docker and devspace do
  const envs = loadEnvs({ env: params.env })

  // Get the auth token in the same way docker and devspace do
  const token = pToken
    || envs.GB_LT_TOKEN_SECRET
    || process.env.GB_LT_TOKEN_SECRET
    
  if(!token) error.throwError(`The a token or ENV named "GB_LT_TOKEN_SECRET" is required`)
  
  const hidden = `${token.slice(0, 2 - token.length)}${token.slice(2, token.length).split('').map(() => '*').join('')}` 
  params.log && Logger.pair(`Found value for secret token`, hidden)

  await secretTask.action({
    ...args,
    params: {
      ...secParams,
      secrets: token,
      value: token,
      literal: true,
      name: `goblet-token`,
    }
  })
}

export const goblet:TTask = {
  name: `goblet`,
  action: addGobletToken,
  alias: [ `gob`, `tok`, `gt`],
  example: `pnpm kube secrets goblet <options>`,
  description: `Calls the kubectl create secrets command with the goblet-token`,
  options: {
    token: {
      alias: [`tok`],
      example: `--token ****`,
      description: `Custom goblet token used by the latent repo, defaults to "GB_LT_TOKEN_SECRET" env`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the task output`,
    },
  },
}
