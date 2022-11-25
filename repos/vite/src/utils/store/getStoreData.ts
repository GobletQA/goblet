import type { TRepoState, TContainerState } from '@types'

import { getStore } from '@store'
import { noOpObj } from '@keg-hub/jsutils'


/**
 * Helper to get the repo name form the store
 *
 */
export const getRepoData = () => {
  const storeItems = getStore()?.getState()
  return (storeItems?.repo || noOpObj) as TRepoState
}

export const getContainerData = () => {
  const storeItems = getStore()?.getState()
  return (storeItems?.container || noOpObj) as TContainerState
}
