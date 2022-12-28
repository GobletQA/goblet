import type { TEvtCallback } from '../../types'

export const stopPropagation = (event?:any, cb?:TEvtCallback) => {
  event?.stopPropagation?.()
  cb?.(event)
}
