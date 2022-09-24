import { VNC_ACTIVE, NO_VNC_PATH } from '@constants'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = () => {
  if(!VNC_ACTIVE) return ``

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'

  return `${proto}://${host}${NO_VNC_PATH}`
}