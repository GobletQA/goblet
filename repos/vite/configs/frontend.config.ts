
import { exists } from '@keg-hub/jsutils'
import { addToProcess } from '@keg-hub/cli-utils'
import { loadConfigs } from '@keg-hub/parse-config'

  // @ts-ignore
import { getGobletConfig } from '../../shared/src/utils/getGobletConfig.js'

const { GOBLET_ENV, NODE_ENV } = process.env
if(GOBLET_ENV && NODE_ENV !== GOBLET_ENV) process.env.NODE_ENV = GOBLET_ENV
else if(!process.env.GOBLET_ENV && NODE_ENV) process.env.GOBLET_ENV = NODE_ENV

/**
 * Is called form the tap.js config in the root
 * Eventually that will be removed and this will be called directly
 */
export const loadConfig = () => {

  addToProcess(
    loadConfigs({
      name: 'goblet',
      locations: [],
      env: process.env.GOBLET_ENV || process.env.NODE_ENV || `local`,
      
    }),
    { force: exists(process.env.GOBLET_ENV) }
  )

  const config = getGobletConfig()
  const firebaseConfig = config.firebase

  const {
    NODE_ENV,
    GB_BE_PORT,
    GB_SC_PORT,
    GB_BE_HOST,
    GB_FE_PORT,
    GB_VNC_ACTIVE,
    GB_NO_VNC_PATH,
    GB_BE_WS_PATH,
    GB_AUTH_ACTIVE,
    GB_WS_TRANSPORTS,
    GB_PW_SOCKET_ACTIVE,
    GB_GITHUB_AUTH_USERS,
    GB_VNC_VIEW_WIDTH,
    GB_VNC_VIEW_HEIGHT,
    FIRE_BASE_PERSISTENCE,
    GB_CD_FORWARD_HOST_HEADER,
    GB_CD_FORWARD_PORT_HEADER,
    GB_CD_FORWARD_PROTO_HEADER,
    GB_CD_FORWARD_SUBDOMAIN_HEADER,
  } = process.env

  const wsServerConfig = {
    port: GB_BE_PORT,
    path: GB_BE_WS_PATH,
    transports: (GB_WS_TRANSPORTS || ``).split(`,`)
  }

  const envs = Object.entries({
    NODE_ENV: NODE_ENV,
    GB_BE_HOST: GB_BE_HOST,
    GB_BE_PORT: GB_BE_PORT,
    GB_SC_PORT: GB_SC_PORT,
    GB_CD_FORWARD_HOST_HEADER,
    GB_CD_FORWARD_PORT_HEADER,
    GB_CD_FORWARD_PROTO_HEADER,
    GB_VNC_ACTIVE: GB_VNC_ACTIVE,
    GB_CD_FORWARD_SUBDOMAIN_HEADER,
    GB_NO_VNC_PATH: GB_NO_VNC_PATH,
    GB_AUTH_ACTIVE: GB_AUTH_ACTIVE,
    GB_PW_SOCKET_ACTIVE: GB_PW_SOCKET_ACTIVE,
    GB_GITHUB_AUTH_USERS: GB_GITHUB_AUTH_USERS,
    GB_VNC_VIEW_WIDTH: `${GB_VNC_VIEW_WIDTH}`,
    GB_VNC_VIEW_HEIGHT: `${GB_VNC_VIEW_HEIGHT}`,
    FIRE_BASE_PERSISTENCE: FIRE_BASE_PERSISTENCE,
    WS_SERVER_CONFIG: JSON.stringify(wsServerConfig),
    ...(firebaseConfig.ui && {
      FIRE_BASE_CONFIG: JSON.stringify(firebaseConfig),
    }),
  }).reduce((acc, [key, value]) => {
    acc[`process.env.${key}`] = JSON.stringify(value)
    return acc
  }, {} as Record<string, string>)

  return {
    envs: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...envs
    },
    port: parseInt(GB_FE_PORT || '19006', 10),
  }
}
