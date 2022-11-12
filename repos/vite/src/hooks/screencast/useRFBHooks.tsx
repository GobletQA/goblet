import type {
  EEvents,
  TCanvasExt,
  TCanvasProps,
  TCredentials,
} from '@types'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'

const useDisconnectCB = (
  props:TCanvasProps,
  ext:TCanvasExt
) => {

  const {
  rfb,
  logger,
  timeouts,
  connected,
  _onDisconnect,
  eventListeners,
} = ext

  const disconnect = useCallback(() => {

    try {

      if (!rfb?.current){
        _onDisconnect?.()
        return
      }

      timeouts.current.forEach(clearTimeout)

      Object.keys(eventListeners.current).forEach((evt:string) => {
        const event = evt as keyof typeof EEvents
        if(!eventListeners.current[event]) return

        rfb?.current?.removeEventListener(event, eventListeners.current[event] as any)
        eventListeners.current[event] = undefined
      })

      rfb?.current?.disconnect()
      rfb.current = null
      connected.current = false
      _onDisconnect?.()
    }
    catch (err) {
      logger.error(err)
      rfb.current = null
      connected.current = false
    }
  }, [_onDisconnect])
  
  return {
    disconnect,
    _onDisconnect,
  }
}


export const useRFBHooks = (props:TCanvasProps, ext:TCanvasExt) => {

  const { rfb } = ext
  const { disconnect } = useDisconnectCB(props, ext)

  const setRfb = useCallback((_rfb: RFB | null) => {
    rfb.current = _rfb
  },[])
  
  const sendCredentials = useCallback((credentials: TCredentials) => {
    rfb?.current?.sendCredentials(credentials)
  }, [])

  const sendKey = useCallback((keysym: number, code: string, down?: boolean) => {
    rfb?.current?.sendKey(keysym, code, down)
  }, [])

  const sendCtrlAltDel = useCallback(() => {
    rfb?.current?.sendCtrlAltDel()
  }, [])

  const focus = useCallback(() => {
    console.log(`------- focus rfb -------`)
    rfb?.current?.focus()
  }, [])

  const blur = useCallback(() => {
    console.log(`------- blur rfb -------`)
    rfb?.current?.blur()
  }, [])

  const machineShutdown = useCallback(() => {
    rfb?.current?.machineShutdown()
  }, [])

  const machineReboot = useCallback(() => {
    rfb?.current?.machineReboot()
  }, [])

  const machineReset = useCallback(() => {
    rfb?.current?.machineReset()
  }, [])

  const clipboardPaste = useCallback((text: string) => {
    rfb?.current?.clipboardPasteFrom(text)
  }, [])

  return {
    blur,
    focus,
    setRfb,
    sendKey,
    disconnect,
    machineReset,
    machineReboot,
    clipboardPaste,
    sendCtrlAltDel,
    machineShutdown,
    sendCredentials,
  }

} 