import { exists } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { useInline } from '@GBC/hooks/components/useInline'
import { useEffectOnce } from '@GBC/hooks/components/useEffectOnce'

export type TAnonFunc = (...args:any[]) => any

export const useOnEvent = <P=Record<any, any>>(
  event:string,
  cb?:TAnonFunc,
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

export const onEmitEvent = <P=Record<any, any>>(
  event:string,
  params:P,
  ...args:any[]
) => EE.emit<P>(event, params, ...args)

export const useEventEmit = <P=Record<any, any>>(
  event:string,
  params?:P
) => {

  return useInline((...args:any[]) => onEmitEvent<P>(
    event,
    exists(params) ? params : args.shift(),
    ...args
  ))
}
