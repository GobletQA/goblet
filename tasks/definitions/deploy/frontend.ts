import { appRoot } from '../../paths'
import { Logger } from '@keg-hub/cli-utils'
import { docker } from '../../utils/docker/docker'
import { loadEnvs } from '../../utils/envs/loadEnvs'
import { getRunImg } from '../../utils/docker/getRunImg'
import { getNpmToken } from '../../utils/envs/getNpmToken'
import { addRunEnvs } from '../../utils/docker/addRunEnvs'
import { getRunArgs } from '../../utils/docker/getRunArgs'
import { addRunPorts } from '../../utils/docker/addRunPorts'
import { getParamEnvs } from '../../utils/envs/getParamEnvs'
import { addRunVolumes } from '../../utils/docker/addRunVolumes'
import { getFirebaseToken } from '../../utils/firebase/getFirebaseToken'


const deployFe = async (args:Record<any, any>) => {
  const { params } = args
  const docFileCtx = `frontend`
  const { env, log } = params
  const envs = loadEnvs({ env })
  const token = getNpmToken()

  const allEnvs = { ...envs, NPM_TOKEN: token, ...getParamEnvs(params) }

  const imgToRun = await getRunImg(params, docFileCtx, envs)
  const runEnvs = await addRunEnvs(docFileCtx, allEnvs)
  
  getFirebaseToken(params, envs)
  
  const cmdArgs = [
    ...getRunArgs(params),
    ...runEnvs,
    ...addRunPorts(params, allEnvs, docFileCtx),
    ...addRunVolumes(params, docFileCtx),
    imgToRun,
    `/deploy.sh`,
  ].filter((arg) => arg)

  log && Logger.pair(`Running Cmd:`, `docker ${cmdArgs.join(' ')}\n`)

  const output = await docker.run(cmdArgs, { cwd: appRoot, env: allEnvs })
  log && Logger.log(output)

}

export const frontend = {
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