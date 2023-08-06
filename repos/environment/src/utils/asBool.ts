
import {TEnvConvertOpts} from "@GENV/types"
import {emptyObj, isBool, toBool} from "@keg-hub/jsutils"
import { ensureVal } from './ensureVal'
import { responseVal } from "./responseVal"

const valToBool = (item:any) => (item === `f` ? false : toBool(item))

export const asBool = (item:any, opts:TEnvConvertOpts<boolean>=emptyObj) => {
  return isBool(item)
    ? item
    : responseVal(
        ensureVal<boolean>(item, valToBool, opts),
        isBool,
        opts
      )
}