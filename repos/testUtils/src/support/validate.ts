import type { TGBWorldCfg } from '@GTU/Types'
import { isObj } from '@keg-hub/jsutils/isObj'

/**
 * Validates that the world input is a valid world object
 * @param {Object?} world
 */
const validateWorld = (world:TGBWorldCfg) => {
  if (!isObj(world)) throw new Error(`World must be an object. Found ${world}`)
}

/**
 * Validates that the world object has a registered ancestor
 * @param {Object} world
 */
export const checkForAncestor = (world:TGBWorldCfg) => {
  validateWorld(world)

  if (!isObj(world.meta) || !isObj(world.meta.ancestor))
    throw new Error(
      'Cannot find ancestor. Use an ancestor-registration step before running this step'
    )
}

