import type { TGobletConfig } from '@GWF/types'

import { getClientWorld } from './getClientWorld'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'

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
