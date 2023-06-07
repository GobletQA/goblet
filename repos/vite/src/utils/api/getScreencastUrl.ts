import type { TContainerState } from '@types'
import {
  VNC_ACTIVE,
  NO_VNC_PATH,
} from '@constants'
import { objToQuery } from '@keg-hub/jsutils'
import { getBaseApiUrl } from '@utils/api/getBaseApiUrl'
import { getContainerData } from '@utils/store/getStoreData'
import {getSocketQueryData} from './getSocketQueryData'


/**
 * Returns the generated screencast url if VNC_ACTIVE is active
 */
export const getScreencastUrl = (container?:TContainerState) => {
  if(!VNC_ACTIVE) return ``

  const base = getBaseApiUrl()
  const { host } = new URL(base)
  const { protocol } = new URL(window.location.origin)
  const proto = protocol.includes('https') ? 'wss' : 'ws'

  const socketData = getSocketQueryData(`screencast`, container)

  return Object.keys(socketData).length
    ? `${proto}://${host}${NO_VNC_PATH}${objToQuery(socketData)}`
    : ``
}