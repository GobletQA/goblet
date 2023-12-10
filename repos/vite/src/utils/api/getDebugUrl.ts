import type { TContainerState } from '@types'

import { DEBUG_CONFIG } from '@constants'
import { getBaseUrl } from './getBaseUrl'
import { objToQuery } from '@keg-hub/jsutils'
import {getSocketQueryData} from './getSocketQueryData'


export const getDebugUrl = (container?:TContainerState) => {
  const { url, https, protocol } = getBaseUrl()
  const socketData = getSocketQueryData(`api`, container)
  const query = objToQuery(socketData)

  return `${url.host}${DEBUG_CONFIG.path}${query}`

}