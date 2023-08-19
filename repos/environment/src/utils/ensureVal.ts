import type { TEnvConvertOpts } from '../types'
import { exists } from '../utils/helpers'

export const ensureVal = <T=any>(
  item:T,
  cb:(val:any) => T,
  opts:TEnvConvertOpts<T>={}
) => {
  return opts.exists && !exists(item)
    ? opts?.default
    : cb(item)
}