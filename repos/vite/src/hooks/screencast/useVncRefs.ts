import type {TBrowserProps, TBrowserEventListeners, TBrowserLogger } from '@types'
import type { MutableRefObject } from 'react'

import { noOp } from '@keg-hub/jsutils'
import RFB from '@novnc/novnc/core/rfb'
import { useMemo, useRef, useState, useCallback } from 'react'

const useLogger = (debug:boolean):TBrowserLogger => {
  return useMemo(() => ({
    log: (...args: any[]) => debug && console.log(...args),
    info: (...args: any[]) => debug && console.info(...args),
    error: (...args: any[]) => debug && console.error(...args),
  }), [debug])
}

export const useVncRefs = (props:TBrowserProps) => {

  const connectRef = useRef(noOp)
  const disconnectRef = useRef(noOp)
  const rfb = useRef<RFB | null>(null)
  const firstLoad = useRef<boolean>(true)
  const logger = useLogger(props.debug || false)
  const screen = useRef<HTMLDivElement|null>(null)
  const timeouts = useRef<Array<NodeJS.Timeout>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const eventListeners = useRef<TBrowserEventListeners>({})
  const connected = useRef<boolean>(props.autoConnect ?? true)

  // Wraps the screen ref, to allow watching when it gets set
  // Every type react resets the ref, it calls this callback instead
  // This way we can track the dom node, and check if rfd needs reset as well
  const onScreenNode = useCallback((node:HTMLDivElement) => {
    screen.current = node
    if(firstLoad.current) return (firstLoad.current = false)

    // If the rfb target is on the dom, then no need to reset it
    if(document.body.contains(rfb.current?._target as Node | null)) return

    // Reset the first load, and call disconnect
    // This will force an auto-reconnect, which is why firstLoad is reset
    firstLoad.current = true
    disconnectRef.current?.()
  }, [])

  return {
    rfb,
    logger,
    screen,
    loading,
    timeouts,
    connected,
    setLoading,
    connectRef,
    onScreenNode,
    disconnectRef,
    eventListeners
  }
}