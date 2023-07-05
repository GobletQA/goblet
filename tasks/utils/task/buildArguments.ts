import type { TTaskParams } from '../../types'
import { mapObj, exists } from '@keg-hub/jsutils'

/**
 * Builds cli arguments. Appends `--` if key doesn't already have it
 * @param {Object} params
 *
 * @returns {Array<string>} - array of cli args
 */
export const buildArguments = (params:TTaskParams) => {
  const array =
    mapObj(params, (key, value) => {
      // if value is null/undefined, don't create a string for it
      return exists(value)
        ? !key.match('^--')
          ? `--${key} ${value}`
          : `${key} ${value}`
        : null
    }) || []

  return array.filter(Boolean)
}

