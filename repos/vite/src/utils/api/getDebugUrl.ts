import type { TContainerState } from '@types'


import { getBaseUrl } from './getBaseUrl'
import { objToQuery } from '@keg-hub/jsutils'
import { Environment, DEBUG_CONFIG } from '@constants'
import {getSocketQueryData} from './getSocketQueryData'

export const getDebugHost = () => {
  return Environment !== `production` ? `http://localhost:8000/index.html` : `https://lancetipton.github.io/chrome-devtools/index.html`
}

export const getDebugUrl = (apiUrl:URL) => {
  const { url } = getBaseUrl()
  const pageId = apiUrl.pathname.split(`/`).pop()
  const socketData = getSocketQueryData(`api`)
  const query = objToQuery(socketData)

  return {
    api: `${url.host}${DEBUG_CONFIG.path}/${pageId}${encodeURIComponent(query)}`,
  }

}