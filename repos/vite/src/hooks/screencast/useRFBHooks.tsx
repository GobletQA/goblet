import type {
  EEvents,
  TBrowserExt,
  TCredentials,
  TBrowserProps,
} from '@types'

import { useCallback } from 'react'


const useDisconnectCB = (
  props:TBrowserProps,
  ext:TBrowserExt
) => {

  const {
  rfb,
  logger,
  timeouts,
  connected,
  _onDisconnect,
  eventListeners,
} = ext

  return useCallback(() => {
    const rfbObj = rfb?.current || undefined

    try {

      if (!rfbObj){
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
      _onDisconnect?.(rfbObj)
    }
    catch (err) {
      logger.error(err)
      rfb.current = null
      connected.current = false
    }
  }, [_onDisconnect])

}


export const useRFBHooks = (props:TBrowserProps, ext:TBrowserExt) => {

  const { rfb, disconnectRef } = ext

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
    rfb?.current?.focus()
  }, [])

  const blur = useCallback(() => {
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
  }, [rfb?.current])

  const disconnect = useDisconnectCB(props, ext)
  disconnectRef.current = disconnect

  return {
    blur,
    focus,
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