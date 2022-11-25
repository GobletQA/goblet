import type { TProxyRoute } from '@types'
import {
  VNC_ACTIVE,
  NO_VNC_PATH,
} from '@constants'
import { objToQuery } from '@keg-hub/jsutils'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'
import { getContainerData } from '@utils/store/getStoreData'

/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = (screencast?:TProxyRoute) => {
  if(!VNC_ACTIVE) return ``

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'
  const headers = screencast?.headers || getContainerData()?.screencast?.headers

  return headers
    ? `${proto}://${host}${NO_VNC_PATH}${objToQuery(headers)}`
    : ``
  
}