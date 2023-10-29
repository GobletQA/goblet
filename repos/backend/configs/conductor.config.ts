import type {
  TProtocol,
  TRouteMeta,
  TConductorOpts,
  TControllerType,
  TControllerConnectOpts,
} from '@GBE/types'

import { ENVS } from '@gobletqa/environment'
import { toNum } from '@keg-hub/jsutils/toNum'
import { toBool } from '@keg-hub/jsutils/toBool'
import { exists } from '@keg-hub/jsutils/exists'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { loadEnvs } from '@gobletqa/shared/utils/loadEnvs'
import { getKindHost } from '@gobletqa/conductor/utils/getKindHost'
import { getDindHost } from '@gobletqa/conductor/utils/getDindHost'

const {
  NODE_ENV=`local`,
  GB_LT_TOKEN_SECRET,
  GB_GIT_PROVIDER_DATA,
} = process.env


loadEnvs({
  force: true,
  name: `goblet`,
  locations: [],
  ignore: [`GB_LOCAL_DEV_MODE`],
  override: NODE_ENV === 'local'
})

const {
  GB_LOCAL_DEV_MODE,
  GOBLET_SCREENCAST_PORT,
  GOBLET_SCREENCAST_SERVICE_HOST,

  GB_SC_PORT,
  GB_SC_IMAGE,
  GB_SC_ACTIVE,
  GB_SC_IMAGE_TAG,
  GB_SC_DEPLOYMENT,
  GB_NO_VNC_PORT,
  GB_CD_CONTROLLER_TYPE,
  GB_CD_LISTENER_TIMEOUT,

  GB_KUBE_NAMESPACE,

  GB_KD_PORT,
  GB_CD_VALIDATION_KEY,
  GB_CD_VALIDATION_HEADER,
  GOBLET_KIND_SERVICE_PORT,
  GB_GIT_REMOTE_REF,
  GB_GIT_GLOBAL_IGNORE,

} = process.env


const whiteList = [
  `GB_SC`,
  `GB_LOG`,
  `GB_VNC`,
  `DISPLAY`,
  `PLAYWRIGHT_`,
  `GB_NO_VNC`,
  `GB_VNC_PASS`,
  `GB_CD_VALIDATION`,
  `GB_SERVER_ORIGINS`,
  `GB_BE_WS_PATH`,
  `GB_BE_SECURE_PORT`,
  `GB_BE_JWT_EXP`,
  `GB_BE_JWT_ALGO`,
  `GB_BE_JWT_SECRET`,
  `GB_GIT_REMOTE_REF`,
  `GB_SECRETS_TAG_REF`,
  `GB_LT_TOKEN_SECRET`,
  `GB_GIT_GLOBAL_IGNORE`,
  `GB_GIT_PROVIDER_DATA`,
  `GB_BE_JWT_CREDENTIALS`,
  `GB_BE_JWT_REFRESH_EXP`,
  `GB_BE_JWT_REFRESH_SECRET`,
  `GB_SC_IDLE_INTERVAL`,
  `GB_SC_IDLE_THRESHOLD`,
  `GB_SC_IDLE_WAIT_TO_START`,
  `GB_SC_IDLE_TIMEOUT_ACTIVE`,
  `GB_SC_IDLE_CONNECTION_THRESHOLD`,
]

const blackList = []

const isDockerHost = (GB_CD_CONTROLLER_TYPE || ``).toLowerCase() === `docker`
const controllerHost = isDockerHost
  ? getDindHost()
  : getKindHost()


// Enable this to use a locally running screencast container
// Can be used when testing a new screencast docker image build
const screencastManual = false
const screencastHost = screencastManual ? `host.docker.internal` : GB_SC_DEPLOYMENT

// TODO: look into passing the GB_*_ACTIVE envs to the pods on deployment
// That and update GB_LOCAL_DEV_MODE env to be set via a argument when starting
// When running without auto-starting the screencast pod
const devRouter = screencastManual
  || (
      NODE_ENV === `local`
        && toBool(GB_LOCAL_DEV_MODE)
        && exists(GOBLET_SCREENCAST_SERVICE_HOST)
        && exists(GOBLET_SCREENCAST_PORT)
    )
    ? {
        meta: {
          state: `Running`,
          id: GB_SC_DEPLOYMENT,
          host: screencastHost,
          name: GB_SC_DEPLOYMENT,
        },
        routes: {
          [GB_SC_PORT]: {
            port: GB_SC_PORT,
            host: screencastHost,
            containerPort: GB_SC_PORT,
            protocol: 'http:' as TProtocol,
          },
          [GB_NO_VNC_PORT]: {
            port: GB_NO_VNC_PORT,
            host: screencastHost,
            containerPort: GB_NO_VNC_PORT,
            protocol: 'http:' as TProtocol,
          }
        }
      }
    : {}




/**
* Loads the envs and filters out all except for the those the match the whiteList prefix
*/
const containerEnvs = Object.entries(process.env)
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
  const tag = GB_SC_IMAGE_TAG || (name || ``).split(':').pop()

  if(!provider || !user || !name || !tag || !GB_SC_DEPLOYMENT)
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
    deployment: GB_SC_DEPLOYMENT,
  }
}

const buildConductorConf = () => {
  return isDockerHost
    ? {}
    : {
        proxy: {
          port: GB_KD_PORT,
          target: `${proto}://${controllerHost}:${GB_KD_PORT}`,
          headers: {
            [`content-type`]: `application/json`,
            [GB_CD_VALIDATION_HEADER]: GB_CD_VALIDATION_KEY
          }
        },
        controller: {
          namespace: GB_KUBE_NAMESPACE,
          options: {
            protocol: `http`,
            host: controllerHost,
            port: GOBLET_KIND_SERVICE_PORT,
          } as TControllerConnectOpts,
        },
      }
}

const proto = GB_KD_PORT === `443` ? `https` : `http`
export const conductorConfig:TConductorOpts = deepMerge({
  controller: {
    devRouter: devRouter as TRouteMeta,
    type: GB_CD_CONTROLLER_TYPE as TControllerType,
    listenerTimeout: toNum(GB_CD_LISTENER_TIMEOUT || 25000)
  },
  images: {
    [GB_SC_DEPLOYMENT]: {
      ...getImgConfig(),
      container: {
        mem: 0,
        idle: 5000,
        timeout: 5000,
        rateLimit: 5000,
        retryCount: 2,
        restartPolicy: isDockerHost ? `on-failure` : `OnFailure`,
        ports: [
          // Screencast API Port
          toNum(GB_SC_PORT),
          // NoVnc Websocket Port
          toNum(GB_NO_VNC_PORT),
        ].filter(Boolean),
        envs: {
          ...containerEnvs,
          GB_VNC_ACTIVE: true,
          
          // Location of the global git ignore file
          GB_GIT_GLOBAL_IGNORE: ENVS.GB_GIT_GLOBAL_IGNORE,

          // Used to generate the secret from a repository tag. Is NOT secret and can be public
          GB_SECRETS_TAG_REF: ENVS.GB_SECRETS_TAG_REF,

          // Repo Tokens secret - This should never be shared outside goblet... ever!!!
          GB_LT_TOKEN_SECRET,

          // TODO: Remove this when PAT's are fully integrated
          GB_GIT_PROVIDER_DATA,

          // Name of the remote origin used on mounted repos
          GB_GIT_REMOTE_REF,

          // Amount to time to wait before auto-killing the container
          GB_SC_IDLE_INTERVAL: containerEnvs.GB_SC_IDLE_INTERVAL || `20`,
          GB_SC_IDLE_THRESHOLD: containerEnvs.GB_SC_IDLE_THRESHOLD || `2`,
          GB_SC_IDLE_WAIT_TO_START: containerEnvs.GB_SC_IDLE_WAIT_TO_START || `120`,
          GB_SC_IDLE_CONNECTION_THRESHOLD: containerEnvs.GB_SC_IDLE_CONNECTION_THRESHOLD || `2`,
          GB_SC_IDLE_TIMEOUT_ACTIVE: containerEnvs.GB_SC_IDLE_TIMEOUT_ACTIVE || NODE_ENV !== `local`,
        },
        runtimeEnvs: {}
      }
    }
  }
}, buildConductorConf())
