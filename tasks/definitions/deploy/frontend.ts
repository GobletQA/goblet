import { TTaskActionArgs, TTask, TEnvObject } from '../../types'

import { frontendDir } from '../../paths'
import { Logger, yarn } from '@keg-hub/cli-utils'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { firebase } from '../../utils/firebase/firebase'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { getParamEnvs } from '../../utils/envs/getParamEnvs'
import { updateVersion } from '../../utils/helpers/updateVersion'

const bundleFrontend = async (args:TTaskActionArgs, envs:TEnvObject) => {
  const log = args?.params?.log

  // Build the goblet frontend application
  log && Logger.pair(`Running frontend build command`, `yarn build`)

  await yarn([`build`], {
    envs,
    cwd: frontendDir,
  })

  log && Logger.success(`\n[Success] ${Logger.colors.white('Frontend built successfully')}\n`)
}


const deployFe = async (args:TTaskActionArgs) => {
  const { params } = args
  const { env, log, version } = params

  const envs = loadEnvs({ env })
  const token = getNpmToken()
  const allEnvs = { ...envs, NPM_TOKEN: token, ...getParamEnvs(params) }

  version && await updateVersion(version, log)

  await bundleFrontend(args, allEnvs)

  const resp = await firebase.deploy.hosting(args.params, allEnvs)

  log && Logger.log(resp)
}

export const frontend:TTask = {
  name: `frontend`,
  alias: [`fe`],
  action: deployFe,
  options: {
    build: {
      default: true,
      type: `boolean`,
      example: `--build`,
      alias: [`bld`, `bl`, `bundle`, `bun`],
      description: `Rebuilds the frontend docker image before running it`,
    },
    token: {
      alias: [`tok`],
      example: `--token <my-firebase-token>`,
      description: `Set the firebase token to use when deploying`,
    },
    version: {
      alias: [`ver`],
      example: `--version`,
      description: `Updates the version of the frontend app before bundling and deploying`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log command before they are build`,
    },
  }
}