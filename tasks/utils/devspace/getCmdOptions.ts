import type { TTaskParams } from '../../types'
import { noOpObj, noPropArr, exists } from '@keg-hub/jsutils'

export type TCmdFlags = {
  [key:string]: string
}

/**
 * Extracts the args for the devspace command from the params object
 *
 * @returns {Array} - Argument array with the devspace options added
 */
export const getCmdOptions = (
  params:TTaskParams,
  flags:TCmdFlags = noOpObj as TCmdFlags,
  values:string[] = noPropArr as string[]
) => {
  return Object.entries(params)
    .reduce((options, [key, value]:[string, string]) => {
      if (flags[key] && value) options.push(flags[key])
      else if (values.includes(key) && exists(value)) options.push(`--${key}`, value)

      return options
    }, [] as string[])
}

