import type { TContainerState } from '@types'

import { WS_CONFIG } from '@constants'
import { getBaseUrl } from './getBaseUrl'
import {getSocketQueryData} from './getSocketQueryData'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getWebsocketConfig = (container?:TContainerState) => {

  const { url, https, protocol } = getBaseUrl()
  const socketData = getSocketQueryData(`api`, container)

  return {
    host: url.host,
    ...WS_CONFIG,
    extraHeaders: {
      ...WS_CONFIG?.headers,
      ...socketData
    },
    query: {
      ...WS_CONFIG?.query,
      // Pass the headers in the query because websocket
      // doesn't pass extra headers for some protocols
      ...socketData
    },
    endpoint: `${protocol}//${url.host}`,
    protocol: https ? 'wss' : 'ws',
    port: https ? '' : WS_CONFIG.port,
  }
}