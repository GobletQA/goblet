import { useCallback } from 'react'
import { useInline } from './useInline'
import { useEffectOnce } from './useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TAnonFunc = (...args:any[]) => any

export const useEventListen = <P=Record<any, any>>(
  event:string,
  cb:TAnonFunc,
  key:string=event
) => {
  const inline = useInline(cb)
  
  useEffectOnce(() => {
    const off = EE.on<P>(event, inline, key)
    return () => {
      off?.()
    }
  })
}


export const useEventEmit = <P=Record<any, any>>(
  event:string,
  params:P
) => {

  const inline = useInline(() => params)
  return useCallback(() => EE.emit(event, inline()), [])
}