import type { MutableRefObject, SyntheticEvent } from 'react'

import { useCallback, useRef } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { VNCRefocusEvent, Environment } from '@constants'
import { useVncResize } from './useVncResize'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'


export type TVncHandlers = {
  connect:() => void
  autoConnect:boolean
  disconnect:() => void
  rfb:MutableRefObject<RFB | null>
}

const noFocusClasses = [
  `browser-nav-input`,
  `xterm-helper-textarea`
]

const refocusClasses = [
  `gb-refocus`,
  `goblet-editor`
]

const refocusElements = [
  `a`,
  `area`,
  `button`,
  `frame`,
  `iframe`,
  `input`,
  `object`,
  `select`,
  `textarea`,
  `svg`,
]

const shouldRefocus = (focused:HTMLElement) => {
  if(!focused) return false

  const hasRefocus = refocusClasses.find(cls => focused?.classList?.contains(cls))
  if(hasRefocus) return true

  const hasEl = refocusElements.includes(focused?.localName)
  if(hasEl) return true

  const noFocus = noFocusClasses.find(cls => focused?.classList?.contains(cls))
  if(noFocus) return false
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

    if(!focusElRef?.current) return

    // Refocus the previous element if one exists
    focusElRef?.current?.focus()
    EE.emit(VNCRefocusEvent, { element: focusElRef?.current })

    focusElRef.current = null
  }, [])

  const onMouseEnter = useCallback((event:SyntheticEvent) => {
    // Find the currently focused element
    const focused = (document.querySelector(`:focus`) || document?.activeElement) as HTMLElement

    if(shouldRefocus(focused)){
      // Blur it, and store it for refocus later
      focused?.blur?.()
      focusElRef.current = focused
    }

    onClick()
  }, [onClick])

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
  }
}
