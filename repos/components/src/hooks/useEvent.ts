import type { TEventCB } from '@gobletqa/shared/libs/eventEmitter'

import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { useInline } from '@GBC/hooks/components/useInline'
import { useEffectOnce } from '@GBC/hooks/components/useEffectOnce'

export type TAnonFunc = (...args:any[]) => any

export const useOnEvent = <P=Record<any, any>>(
  event:string,
  cb?:TEventCB<P>,
  key:string=event
) => {
  const inline = useInline<TEventCB<P>>(cb)
  
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

