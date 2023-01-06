import type { TGobletConfig } from '../types'

import { deepMerge } from '@keg-hub/jsutils'
import { getClientWorld } from './getClientWorld'

/**
 * Merge of world defaults with client world
 */
export const getWorld = (
  repo?:TGobletConfig
) => {
  return deepMerge(
    {
      app: {
        url: process.env.GOBLET_APP_URL,
      },
    },
    getClientWorld(repo)
  )
}
