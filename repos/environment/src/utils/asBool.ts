
import type { TEnvConvertOpts } from '../types'

import { ensureVal } from './ensureVal'
import { responseVal } from './responseVal'
import {toBool} from '@keg-hub/jsutils/toBool'
import {isBool} from '@keg-hub/jsutils/isBool'

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