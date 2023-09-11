import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { Environment } from '@constants'
import { useEffectOnce } from '../useEffectOnce'

export type TVncHandlers = {
  connect:() => void
  autoConnect:boolean
  disconnect:() => void
  rfb:MutableRefObject<RFB | null>
}

export const useVncHandlers = (props:TVncHandlers) => {

  const {
    rfb,
    connect,
    disconnect,
    autoConnect
  } = props

  useEffectOnce(() => {
    autoConnect && connect()
    return () => Environment !== `local` && disconnect?.()
  })

  const onClick = useCallback(() => rfb?.current?.focus(), [rfb?.current])
  const onMouseLeave = useCallback(() => rfb?.current?.blur(), [rfb?.current])
  const onMouseEnter = useCallback((event:SyntheticEvent) => onClick(), [onClick])

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
  }
}
