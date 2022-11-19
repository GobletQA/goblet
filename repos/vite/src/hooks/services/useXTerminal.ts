import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { XTerminal } from '@services/xterm'

export const useXTerminal = () => {
  const termElRef = useRef<HTMLDivElement|null>(null)
  const termRef = useRef<XTerminal|null>(null)

  useEffect(() => {
    if((termRef && termRef.current) || !termElRef || !termElRef?.current) return

    termRef.current = new XTerminal({element: termElRef.current})

  }, [termRef, termElRef])

  return [termRef.current, termElRef] as [XTerminal, RefObject<HTMLDivElement>]
}