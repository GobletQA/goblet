import { Values } from 'HKConstants'
import { getBaseApiUrl } from 'HKUtils/api/getBaseApiUrl'

const { WS_CONFIG } = Values

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getWebsocketConfig = () => {

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'

  return {
    host,
    ...WS_CONFIG,
    protocol: proto,
    endpoint: `${protocol}//${host}`
  }
}