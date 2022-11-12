import type {TCanvasProps, TCanvasEventListeners, TCanvasLogger } from '@types'

import RFB from '@novnc/novnc/core/rfb'
import { useMemo, useRef, useState } from 'react'

const useLogger = (debug:boolean):TCanvasLogger => {
  return useMemo(() => ({
    log: (...args: any[]) => debug && console.log(...args),
    info: (...args: any[]) => debug && console.info(...args),
    error: (...args: any[]) => debug && console.error(...args),
  }), [debug])
}

export const useVncRefs = (props:TCanvasProps) => {

  const logger = useLogger(props.debug || false)
  const [loading, setLoading] = useState<boolean>(true)

  const rfb = useRef<RFB | null>(null)
  const screen = useRef<HTMLDivElement>(null)
  const timeouts = useRef<Array<NodeJS.Timeout>>([])
  const eventListeners = useRef<TCanvasEventListeners>({})
  const connected = useRef<boolean>(props.autoConnect ?? true)

  const connectRef = useRef(() => {})
  const disconnectRef = useRef(() => {})

  
  return {
    rfb,
    logger,
    screen,
    loading,
    timeouts,
    connected,
    setLoading,
    connectRef,
    disconnectRef,
    eventListeners
  }
}