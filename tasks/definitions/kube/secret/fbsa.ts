import type { TTask, TTaskActionArgs } from '../../../types'

import { error } from'@keg-hub/cli-utils'
import { loadEnvs } from '../../../utils/envs/loadEnvs'

/**
 * Add kubernetes secret for firebase service-account json
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
const fbsaAct = async (args:TTaskActionArgs) => {
  const { params, tasks } = args
  const secretTask = tasks?.kube?.tasks?.secret
  !secretTask &&
    error.throwError(`The "kube.tasks.secret" task can not be found. Ensure it exists before running this command`)

  const { file, name, key=name, log, ...secParams } = params
  const envs = loadEnvs({ env: params.env })

  const loc = file || envs.FIRE_BASE_SERVICE_ACCOUNT

  !loc && error.throwError(`The path to a firebase service-account JSON file is required`)

  await secretTask.action({
    ...args,
    params: {
      ...secParams,
      log,
      key,
      name,
      file: loc,
    }
  })
}

export const fbsa:TTask = {
  name: `fbas`,
  action: fbsaAct,
  alias: [ `firebase`, `fb`, `fbs`, `fsa`],
  example: `pnpm kube secrets fbsa <options>`,
  description: `Creates a kubernetes secret for the firebase service account`,
  options: {
    file: {
      required: true,
      alias: [ `loc`, `sa`],
      env: `FIRE_BASE_SERVICE_ACCOUNT`,
      example: `--file /path/to/service-account.json`,
      description: `Path the the service-account.json file`,
    },
    name: {
      env: `GB_KUBE_SCRT_FB_SA`,
      example: `--name firebase-sa`,
      default: `firebase-sa`,
      description: `Name of the secret when saved`
    },
    key: {
      alias: [`ky`],
      example: `--key secrets-key-name`,
      description: `Key name of the secret, uses name when key is not already set`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log the task output`,
    },
  },
}
