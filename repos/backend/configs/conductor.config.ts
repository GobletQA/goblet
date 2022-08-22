import type {
  TProtocol,
  TConductorOpts,
  TControllerType,
} from '@GBE/types'
import { toNum, exists } from '@keg-hub/jsutils'
import { inDocker } from '@keg-hub/cli-utils'

import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'

const { NODE_ENV=`local`, GB_CD_CONTROLLER_TYPE=`Docker` } = process.env

const whiteList = [
  `GB_SC`,
  `GB_LOG`,
  `GB_VNC`,
  `GB_NO_VNC`,
  `DISPLAY`,
  `PLAYWRIGHT_`,
  `GB_VALIDATION`,
  `GB_SERVER_ORIGINS`,

  `GB_BE_SOCKR_PATH`,
  `GB_BE_SECURE_PORT`,
  `GB_BE_JWT_EXP`,
  `GB_BE_JWT_ALGO`,
  `GB_BE_JWT_SECRET`,
  `GB_BE_JWT_CREDENTIALS`,
  `GB_BE_JWT_REFRESH_EXP`,
  `GB_BE_JWT_REFRESH_SECRET`,

]

const blackList = []

const envs = loadEnvs({
  force: true,
  name: `goblet`,
  locations: [],
  override: NODE_ENV === 'local'
})

const {
  GB_SC_PORT,
  GB_NO_VNC_PORT,
  GB_VNC_SERVER_PORT,
  GB_SC_IMAGE,
  GB_SC_IMAGE_TAG,
  GB_SC_DEPLOYMENT,
  GOBLET_SCREENCAST_PORT,
  GOBLET_SCREENCAST_SERVICE_HOST,
} = envs


const devRouter = NODE_ENV === `local`
  && exists(GOBLET_SCREENCAST_SERVICE_HOST)
  && exists(GOBLET_SCREENCAST_PORT)
    ? {
        host: GB_SC_DEPLOYMENT,
        port: GOBLET_SCREENCAST_PORT,
        protocol: 'http:' as TProtocol,
      }
    : {}

/**
* Loads the envs and filters out all except for the those the match the whiteList prefix
*/
const containerEnvs = Object.entries(inDocker() ? process.env : envs)
  .reduce((acc, [key, value]) => {
    whiteList.find(prefix => key.startsWith(prefix))
      && !blackList.includes(key)
      && (acc[key] = value)

    return acc
  }, {} as Record<string, any>)

/**
* Gets the spawn image metadata from the screencast envs
*/
const getImgConfig = () => {
  const [provider, user, name] = GB_SC_IMAGE.split(`/`)
  const tag = GB_SC_IMAGE_TAG
  if(!provider || !user || !name || !tag)
    throw new Error([
      `Missing required envs:`,
      ` - GB_SC_IMAGE => ${GB_SC_IMAGE}`,
      ` - GB_SC_IMAGE_TAG => ${GB_SC_IMAGE_TAG}`,
      ` - GB_SC_DEPLOYMENT => ${GB_SC_DEPLOYMENT}`
    ].join(`\n`))

  return {
    tag,
    name,
    user,
    provider,
  }
}

export const conductorConfig:TConductorOpts = {
  controller: {
    devRouter,
    type: GB_CD_CONTROLLER_TYPE as TControllerType
  },
  images: {
    [GB_SC_DEPLOYMENT]: {
      ... getImgConfig(),
      container: {
        mem: 0,
        idle: 5000,
        timeout: 5000,
        rateLimit: 5000,
        retryCount: 2,
        restartPolicy: `on-failure`,
        ports: [
          // Screencast API Port
          toNum(GB_SC_PORT),
          // NoVnc Websocket Port
          toNum(GB_NO_VNC_PORT),
          // TigerVnc Server port
          toNum(GB_VNC_SERVER_PORT),
        ].filter(Boolean),
        envs: {
          ...containerEnvs,
          GB_VNC_ACTIVE: true,
          GB_AUTH_ACTIVE: true,
        },
        runtimeEnvs: {}
      }
    }
  }
}
