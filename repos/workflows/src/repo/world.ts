import type { TGobletConfig } from '@GWF/types'
import type { TWorldConfig } from '@ltipton/parkin'

import { getClientWorld } from './getClientWorld'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'

/**
 * Merge of world defaults with client world
 */
export const getWorld = (
  repo?:TGobletConfig
) => {
  return deepMerge<TWorldConfig>(
    {
      app: {
        url: process.env.GOBLET_APP_URL,
      },
    },
    getClientWorld(repo)
  )
}
