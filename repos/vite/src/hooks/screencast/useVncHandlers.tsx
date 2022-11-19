import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { Environment } from '@constants'
import { useVncResize } from './useVncResize'
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

  useVncResize(props)

  useEffectOnce(() => {
    autoConnect && connect()

    return () => Environment !== `local` && disconnect?.()
  })

  const onClick = useCallback(() => {
    rfb?.current?.focus()
  }, [])

  const onMouseLeave = useCallback(() => {
    rfb?.current?.blur()
  }, [])

  const onMouseEnter = useCallback((event:SyntheticEvent) => {
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
