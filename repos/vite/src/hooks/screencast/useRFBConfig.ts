import type {
  TConnectExt,
  TBrowserProps,
} from '@types'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { noOpObj } from '@keg-hub/jsutils'


export const useRFBConfig = (props:TBrowserProps, ext:TConnectExt) => {
  const {
    url,
    onBell,
    viewOnly,
    onKeyDown,
    background,
    onClipboard,
    qualityLevel,
    focusOnClick,
    clipViewport,
    dragViewport,
    scaleViewport,
    resizeSession,
    showDotCursor,
    onCapabilities,
    compressionLevel,
    onSecurityFailure,
    rfbOptions=noOpObj,
  } = props
  
  const {
    rfb,
    screen,
    logger,
    connected,
    _onConnect,
    _onDisconnect,
    _onDesktopName,
    disconnectRef,
    eventListeners,
    _onCredentialsRequired,
  } = ext

  return useCallback(() => {
    try {

      // URL is required, so don't build RFB any until the url exists
      if(!url) return

      // If connected is set and old rfb exists, then disconnect it
      // So we can create the new one
      connected.current
        && !!rfb
        && disconnectRef?.current?.()

      if (!screen.current)
        return console.warn(`Error loading browser. Dom Element could not be found.`)

      screen.current.innerHTML = ''

      const _rfb = new RFB(screen.current, url, {
        wsProtocols: ['binary', 'base64'],
        ...rfbOptions,
      })

      _rfb.viewOnly = viewOnly ?? false
      _rfb.focusOnClick = focusOnClick ?? false
      _rfb.clipViewport = clipViewport ?? false
      _rfb.dragViewport = dragViewport ?? false
      _rfb.resizeSession = resizeSession ?? false
      _rfb.scaleViewport = scaleViewport ?? false
      _rfb.showDotCursor = showDotCursor ?? false
      _rfb.background = background ?? ''
      _rfb.qualityLevel = qualityLevel ?? 0
      _rfb.compressionLevel = compressionLevel ?? 9
      rfb.current = _rfb

      eventListeners.current.bell = onBell
      eventListeners.current.connect = _onConnect
      eventListeners.current.clipboard = onClipboard
      eventListeners.current.disconnect = _onDisconnect
      eventListeners.current.desktopname = _onDesktopName
      eventListeners.current.capabilities = onCapabilities
      eventListeners.current.credentialsrequired = _onCredentialsRequired
      eventListeners.current.securityfailure = onSecurityFailure

      Object.keys(eventListeners.current).forEach((evt:string) => {
        const event = evt as keyof typeof eventListeners.current
        eventListeners.current[event]
          && _rfb.addEventListener(event, eventListeners.current[event] as any)
      })

      onKeyDown && screen.current.addEventListener("keydown", onKeyDown, true)
      connected.current = true

    }
    catch (err) {
      logger.error(err)
    }
  }, [
    url,
    onBell,
    viewOnly,
    onKeyDown,
    background,
    rfbOptions,
    onClipboard,
    qualityLevel,
    focusOnClick,
    clipViewport,
    dragViewport,
    scaleViewport,
    resizeSession,
    showDotCursor,
    onCapabilities,
    compressionLevel,
    onSecurityFailure,
  ])

}

