import { TTask } from '../../types'

import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { getParamEnvs } from '../../utils/envs/getParamEnvs'
import { getFirebaseToken } from '../../utils/firebase/getFirebaseToken'


const deployFe = async (args:Record<any, any>) => {
  const { params } = args
  const { env } = params
  const envs = loadEnvs({ env })
  const token = getNpmToken()

  const allEnvs = { ...envs, NPM_TOKEN: token, ...getParamEnvs(params) }
  const fbToken = await getFirebaseToken(params, envs)
  
  console.log(`------- allEnvs -------`)
  console.log(allEnvs)
  console.log(`------- fbToken -------`)
  console.log(fbToken)
  
  
  // log && Logger.log(output)

}

export const frontend:TTask = {
  name: `frontend`,
  alias: [`fe`],
  action: deployFe,
  options: {
    build: {
      example: `--build`,
      alias: [`bld`, `bl`],
      description: `Rebuilds the frontend docker image before running it`,
    },
    token: {
      alias: [`tok`],
      example: `--token <my-firebase-token>`,
      description: `Set the firebase token to use when deploying`,
    },
    envs: {
      type: `array`,
      example: `--envs key1:value1,key2:value2`,
      description: `Custom envs to pass to the image. Override the default from values file`,
    },
    mount: {
      alias: [`mt`],
      type: `boolean`,
      example: `--mount `,
      description: `Auto mounts the root directory into the container`,
    },
    log: {
      default: true,
      type: `boolean`,
      description: `Log command before they are build`,
    },
  }
}