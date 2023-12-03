import type { TEnvConvertOpts } from '../types'

import { ensureVal } from './ensureVal'
import { responseVal } from './responseVal'
import {toNum} from '@keg-hub/jsutils/toNum'
import {isNum} from '@keg-hub/jsutils/isNum'

export const asNum = (item:any, opts:TEnvConvertOpts<number>={}) => {
  return isNum(item)
    ? item
    : responseVal<number>(
        ensureVal<number>(item, toNum, opts),
        isNum,
        opts
      )
}