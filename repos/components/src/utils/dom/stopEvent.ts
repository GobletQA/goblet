import type { TEvtCallback } from '../../types'

import { preventDefault } from './preventDefault'
import { stopPropagation } from './stopPropagation'

export const stopEvent = (evt:any, cb?:TEvtCallback) => {
  preventDefault(evt)
  stopPropagation(evt, cb)
}