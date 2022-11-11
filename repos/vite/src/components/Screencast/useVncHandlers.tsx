import type { MutableRefObject } from 'react'

import RFB from '@novnc/novnc/core/rfb'
import { useEffect, useCallback } from 'react'

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

  useEffect(() => {
    autoConnect && connect()
    return disconnect
  }, [])

  const onClick = useCallback(() => rfb?.current?.focus(), [])
  const onMouseLeave = useCallback(() => rfb?.current?.blur(), [])

  const onMouseEnter = useCallback(() => {
    document.activeElement
      && document.activeElement instanceof HTMLElement
      && document.activeElement.blur()

    onClick()
  }, [onClick])

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
  }
}