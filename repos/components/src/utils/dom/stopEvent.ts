import type { TEvtCallback } from '../../types'

import { preventDefault } from './preventDefault'
import { stopPropagation } from './stopPropagation'

export const stopEvent = (
  evt:any,
  cb?:TEvtCallback,
  ...args:any[]
) => {
  preventDefault(evt)
  stopPropagation(evt, cb, ...args)
}

export const stopEvt = (cb?:TEvtCallback) => (
  (evt:any, ...args:any[]) => stopEvent(evt, cb, ...args)
)