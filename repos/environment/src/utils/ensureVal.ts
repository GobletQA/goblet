import {TEnvConvertOpts} from "@GENV/types"
import {emptyObj, exists} from "@keg-hub/jsutils"

export const ensureVal = <T=any>(
  item:T,
  cb:(val:any) => T,
  opts:TEnvConvertOpts<T>=emptyObj
) => {
  return opts.exists && !exists(item)
    ? opts?.default
    : cb(item)
}