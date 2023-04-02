import type { TEvtCallback } from '../../types'

export const stopPropagation = (
event?:any,
cb?:TEvtCallback,
...args:any[]
) => {
  event?.stopPropagation?.()
  cb?.(event, ...args)
}


export const stopProp = <E=any>(cb?:TEvtCallback) => (
  (evt:E, ...args:any[]) => stopPropagation(evt, cb, ...args)
)