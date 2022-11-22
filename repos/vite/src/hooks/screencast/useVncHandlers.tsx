import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback, useRef } from 'react'
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

  const focusElRef = useRef<HTMLElement| null>(null)

  const onClick = useCallback(() => {
    rfb?.current?.focus()
  }, [])

  const onMouseLeave = useCallback(() => {
    // Blur the browser element
    rfb?.current?.blur()
    // Refocus the previous element if one exists
    focusElRef?.current?.focus()
    // Unset the element, it's no longer needed
    focusElRef.current = null
  }, [])

  const onMouseEnter = useCallback((event:SyntheticEvent) => {
    // Find the currently focused element
    const focused = (document.querySelector(`:focus`) || document?.activeElement) as HTMLElement
    // Blur it, and store it for later
    focused?.blur?.()
    focusElRef.current = focused

    onClick()
  }, [onClick])

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
  }
}
