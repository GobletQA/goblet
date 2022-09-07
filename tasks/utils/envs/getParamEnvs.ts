import { error } from '@keg-hub/cli-utils'
import { noOpObj, ensureArr } from '@keg-hub/jsutils'


/**
 * Converts passed in params to in string format, into key-value pair of Envs
 */
export const getParamEnvs = ({ envs }:Record<"envs", string>) => {
  return !envs
    ? noOpObj
    : (ensureArr(envs) as string[]).reduce((acc:Record<string, string>, item:string) => {
        if(!item.includes(`:`))
          error.throwError(`Missing key/value separator ":" for env: ${item}`)

        const [key, val] = item.split(`:`)
        acc[key] = val

        return acc
      }, {})
}