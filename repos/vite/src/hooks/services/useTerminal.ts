import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { XTerminal } from '@services/xterm'

export const useTerminal = () => {
  const termElRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<XTerminal>(null) 

  useEffect(() => {
    if((termRef && termRef.current) || !termElRef || !termElRef?.current) return

    // @ts-ignore
    termRef.current = new XTerminal({element: termElRef.current})

  }, [termRef, termElRef])

  return [termRef.current, termElRef] as [XTerminal, RefObject<HTMLDivElement>]
}