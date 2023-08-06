import type { EBrowserType, EBrowserName } from '@GBR/types'

import { metadata } from '@GBR/utils/metadata'
import { getServer } from './server'
import { getBrowserType } from '@GBR/utils/getBrowserType'

/**
 * Gets the browser servers websocket endpoint
 * First checks for an existing browser server, and calls wsEndpoint
 * If that does not exist, reads the meta-data and pulls the endpoint from it
 */
export const getServerEndpoint = async (type:EBrowserType|EBrowserName) => {
  const browserType = getBrowserType(type)
  const server = getServer(browserType)
  if(server) return server.wsEndpoint()

  const meta = await metadata.read(browserType)
  if(meta?.endpoint) return meta.endpoint

  throw new Error(`Could not find browser websocket endpoint for browser ${browserType}`)

}