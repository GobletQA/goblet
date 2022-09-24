import { WS_CONFIG } from '@constants'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getWebsocketConfig = () => {

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const isHttps = Boolean(protocol.includes(`https`))

  return {
    host,
    ...WS_CONFIG,
    endpoint: `${protocol}//${host}`,
    protocol: isHttps ? 'wss' : 'ws',
    port: isHttps ? '' : WS_CONFIG.port,
  }
}