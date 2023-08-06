import type { TEnvConvertOpts } from "@GENV/types"

import { ensureVal } from './ensureVal'
import { responseVal } from "./responseVal"
import {emptyObj,  isNum, toNum} from "@keg-hub/jsutils"

export const asNum = (item:any, opts:TEnvConvertOpts<number>=emptyObj) => {
  return isNum(item)
    ? item
    : responseVal<number>(
        ensureVal<number>(item, toNum, opts),
        isNum,
        opts
      )
}