import type { TEnvConvertOpts } from '../types'

import { ensureVal } from './ensureVal'
import { responseVal } from './responseVal'
import {isNum, toNum} from '../utils/helpers'

export const asNum = (item:any, opts:TEnvConvertOpts<number>={}) => {
  return isNum(item)
    ? item
    : responseVal<number>(
        ensureVal<number>(item, toNum, opts),
        isNum,
        opts
      )
}