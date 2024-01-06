import path from 'path'
import { createRequire } from 'module'
import { addToProcess } from '@keg-hub/cli-utils'
import { loadConfigs } from '@keg-hub/parse-config'
import { getFirebaseCfg } from './firebase.config'

const { GOBLET_ENV, NODE_ENV } = process.env
if(GOBLET_ENV && NODE_ENV !== GOBLET_ENV) process.env.NODE_ENV = GOBLET_ENV
else if(!process.env.GOBLET_ENV && NODE_ENV) process.env.GOBLET_ENV = NODE_ENV

const loadFirebaseCfg = () => {
  const requireAliases = createRequire(path.join(__dirname, '../../../configs'))
  // Loading the firebase config requires the alias exists,
  // so registering the aliases must come first
  const { aliases, registerAliases } = requireAliases('./configs/aliases.config')
  registerAliases()

  return {
    aliases,
    firebase: getFirebaseCfg()
  }
}


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
    { force: process.env.GOBLET_ENV !== undefined }
  )

  const {
    aliases,
    firebase
  } = loadFirebaseCfg()

  const {
    NODE_ENV,
    GB_BE_PORT,
    GB_SC_PORT,
    GB_BE_HOST,
    GB_FE_PORT,
    GB_GOBLET_URL,
    GB_VNC_ACTIVE,
    GB_BE_WS_PATH,
    GB_NO_VNC_PATH,
    GB_AUTH_ACTIVE,
    GB_WS_TRANSPORTS,
    GB_DT_PROXY_PORT,
    GB_VNC_VIEW_WIDTH,
    GB_VNC_VIEW_HEIGHT,
    GB_BE_WS_DEBUG_PATH,
    GB_FE_CONTAINER_WAIT,
    GB_GITHUB_AUTH_USERS,
    FIRE_BASE_PERSISTENCE,
    GB_DT_REMOTE_DEBUG_PORT,
    GB_CD_FORWARD_HOST_HEADER,
    GB_CD_FORWARD_PORT_HEADER,
    GB_CD_FORWARD_PROTO_HEADER,
    GB_CD_FORWARD_ROUTE_HEADER,
    GB_CD_FORWARD_SUBDOMAIN_HEADER,
    GB_FE_CONTAINER_CHECK_INTERVAL,
    GB_FE_WS_RECONNECT_INTERVAL,
    GB_FE_WS_RECONNECT_ATTEMPTS,
    GB_APPWRITE_URL,
    GB_APPWRITE_PROJECT,
    GITLAB_AUTH_URL,
    GITLAB_CLIENT_ID,
    GITLAB_CLIENT_SECRET,
  } = process.env

  const wsServerConfig = {
    port: GB_BE_PORT,
    path: GB_BE_WS_PATH,
    transports: (GB_WS_TRANSPORTS || ``).split(`,`)
  }

  const debugProxyConfig = {
    port: GB_BE_PORT,
    path: GB_BE_WS_DEBUG_PATH,
    proxyPort: GB_DT_PROXY_PORT,
    debugPort: GB_DT_REMOTE_DEBUG_PORT,
  }

  const envs = Object.entries({
    GB_GOBLET_URL,
    NODE_ENV,
    GB_BE_HOST,
    GB_BE_PORT,
    GB_SC_PORT,
    GB_VNC_ACTIVE,
    GB_AUTH_ACTIVE,
    GB_NO_VNC_PATH,
    GB_DT_PROXY_PORT,
    GB_BE_WS_DEBUG_PATH,
    GB_GITHUB_AUTH_USERS,
    GB_FE_CONTAINER_WAIT,
    GB_DT_REMOTE_DEBUG_PORT,
    GB_CD_FORWARD_HOST_HEADER,
    GB_CD_FORWARD_PORT_HEADER,
    GB_CD_FORWARD_PROTO_HEADER,
    GB_CD_FORWARD_ROUTE_HEADER,
    GB_FE_CONTAINER_CHECK_INTERVAL,
    GB_CD_FORWARD_SUBDOMAIN_HEADER,
    GB_FE_WS_RECONNECT_INTERVAL,
    GB_FE_WS_RECONNECT_ATTEMPTS,
    GB_APPWRITE_URL,
    GB_APPWRITE_PROJECT,
    GITLAB_AUTH_URL,
    GITLAB_CLIENT_ID,
    GITLAB_CLIENT_SECRET,
    GB_VNC_VIEW_WIDTH: `${GB_VNC_VIEW_WIDTH}`,
    GB_VNC_VIEW_HEIGHT: `${GB_VNC_VIEW_HEIGHT}`,
    FIRE_BASE_PERSISTENCE: FIRE_BASE_PERSISTENCE,
    WS_SERVER_CONFIG: JSON.stringify(wsServerConfig),
    DEBUG_PROXY_CONFIG: JSON.stringify(debugProxyConfig),
    ...(firebase.ui && {
      FIRE_BASE_CONFIG: JSON.stringify(firebase),
    }),
  }).reduce((acc, [key, value]) => {
    acc[`process.env.${key}`] = JSON.stringify(value)
    return acc
  }, {} as Record<string, string>)

  return {
    aliases,
    environment: process.env.NODE_ENV,
    port: parseInt(GB_FE_PORT || '19006', 10),
    envs: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      ...envs
    },
  }
}
