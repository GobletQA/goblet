import type { TConductorOpts, TControllerType } from '@GBE/types'
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
]

const blackList = []

const envs = loadEnvs({
  force: true,
  name: `goblet`,
  locations: [],
  override: NODE_ENV === 'local'
})

const {
  GB_SC_IMAGE,
  GB_SC_IMAGE_TAG,
  GB_SC_DEPLOYMENT
} = envs

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
        ports: [
          // Screencast API Port
          7006,
          // NoVnc Websocket Port
          26369,
          // TigerVnc Server port
          26370
        ],
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
