import type { TProxyRoute } from '@types'

import { WS_CONFIG } from '@constants'
import { noOpObj } from '@keg-hub/jsutils'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'
import { getContainerData } from '@utils/store/getStoreData'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getWebsocketConfig = (api?:TProxyRoute) => {
  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const isHttps = Boolean(protocol.includes(`https`))
  const headers = api?.headers || getContainerData()?.api?.headers || noOpObj

  return {
    host,
    ...WS_CONFIG,
    extraHeaders: {
      ...WS_CONFIG?.headers,
      ...headers
    },
    query: {
      ...WS_CONFIG?.query,
      // Pass the headers in the query because websocket
      // doesn't pass extra headers for some protocols
      ...headers
    },
    endpoint: `${protocol}//${host}`,
    protocol: isHttps ? 'wss' : 'ws',
    port: isHttps ? '' : WS_CONFIG.port,
  }
}