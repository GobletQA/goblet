import {TEnvConvertOpts} from "@GENV/types"
import { emptyObj } from "@keg-hub/jsutils"

export const responseVal = <T=any>(
  val:T,
  validator:(val:any) => boolean,
  opts:TEnvConvertOpts<T>=emptyObj,
) => {
  return opts.force && !validator(val)
    ? opts?.default
    : val
}