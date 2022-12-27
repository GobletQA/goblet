
export type TEvtCallback = (event:any) => any

export const preventDefault = (event?:any, cb?:TEvtCallback) => {
  event?.preventDefault?.()
  cb?.(event)
}
