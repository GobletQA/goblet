import type { TGBWorldCfg, TRepoState } from '@types'

import { getStore } from '@store'
import { get, exists } from '@keg-hub/jsutils'

export type TGetWorldVal = {
  def?:any,
  fb?:string,
  loc?:string,
  location?:string,
  fallback?:string,
  repo?:TRepoState
}

/**
  * Accepts a path to a key on the world object and returns the value
  * Uses dot notation for navigating multiple levels
 */
export const getWorldVal = ({
  fb,
  loc,
  repo,
  fallback=fb,
  location=loc,
  def=undefined,
}:TGetWorldVal) => {
  if(!location && !fallback) return def

  repo = repo || getStore()?.getState()?.repo
  const locationVal = location ? get(repo?.world as TGBWorldCfg, location) : undefined

  const found = exists(locationVal)
    ? locationVal
    : fallback && get(repo?.world as TGBWorldCfg, fallback)

  return exists(found) ? found : def
}