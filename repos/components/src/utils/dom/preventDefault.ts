import type { TEvtCallback } from '../../types'

export const preventDefault = (
  event?:any,
  cb?:TEvtCallback,
  ...args:any[]
) => {
  event?.preventDefault?.()
  cb?.(event, ...args)
}

export const preDef = <E=any>(cb?:TEvtCallback) => (
  (evt:E, ...args:any[]) => preventDefault(evt, cb, ...args)
)