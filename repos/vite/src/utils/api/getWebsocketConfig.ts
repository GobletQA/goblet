import type { TContainerState } from '@types'

import {omitKeys} from '@keg-hub/jsutils'
import { ForwardHeaders, WS_CONFIG } from '@constants'
import {getSocketQueryData} from './getSocketQueryData'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getWebsocketConfig = (container?:TContainerState) => {
  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const isHttps = Boolean(protocol.includes(`https`))
  
  const socketData = getSocketQueryData(`api`, container)

  return {
    host,
    ...WS_CONFIG,
    extraHeaders: {
      ...WS_CONFIG?.headers,
      ...omitKeys(socketData, [ForwardHeaders.routeHeader])
    },
    query: {
      ...WS_CONFIG?.query,
      // Pass the headers in the query because websocket
      // doesn't pass extra headers for some protocols
      ...socketData
    },
    endpoint: `${protocol}//${host}`,
    protocol: isHttps ? 'wss' : 'ws',
    port: isHttps ? '' : WS_CONFIG.port,
  }
}