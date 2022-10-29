
export type TEvtCallback = (event:any) => any

export const stopPropagation = (event?:any, cb?:TEvtCallback) => {
  event?.stopPropagation?.()
  cb?.(event)
}
