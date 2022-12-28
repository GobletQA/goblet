import type { TEvtCallback } from '../../types'

export const preventDefault = (event?:any, cb?:TEvtCallback) => {
  event?.preventDefault?.()
  cb?.(event)
}
