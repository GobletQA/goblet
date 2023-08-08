
import type { TEnvConvertOpts } from '@GENV/types'

import { ensureVal } from './ensureVal'
import { responseVal } from './responseVal'
import {isBool, toBool} from '../utils/helpers'

const valToBool = (item:any) => (item === `f` ? false : toBool(item))

export const asBool = (item:any, opts:TEnvConvertOpts<boolean>={}) => {
  return isBool(item)
    ? item
    : responseVal(
        ensureVal<boolean>(item, valToBool, opts),
        isBool,
        opts
      )
}