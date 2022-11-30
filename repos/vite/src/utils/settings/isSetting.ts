import type { TSetting } from '@types'

import { isObj } from '@keg-hub/jsutils'

/**
 * Helper to check if the passed in item is a setting object
 */
export const isSetting = (item:any):item is TSetting => {
  return isObj(item) && Boolean(`value` in item && `active` in item)
}

