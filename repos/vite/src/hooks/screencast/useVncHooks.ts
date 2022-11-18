import type {
  TBrowserExt,
  TConnectExt,
  TBrowserProps,
  TCredentials,
  TBrowserDetailEvt,
} from '@types'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { VNCConnectedEvt } from '@constants'
import { noOpObj, get } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const useConnectCB = (props:TBrowserProps, ext:TConnectExt) => {
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
      _rfb.qualityLevel = qualityLevel ?? 6
      _rfb.compressionLevel = compressionLevel ?? 2
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

export const useVncHooks = (props:TBrowserProps, ext:TBrowserExt) => {
  const {
    onConnect,
    rfbOptions,
    onDisconnect,
    onDesktopName,
    onCredentialsRequired,
  } = props

  const {
    rfb,
    logger,
    connected,
    connectRef,
    setLoading,
  } = ext

  const _onConnect = useCallback((...args:any[]) => {
    connected.current = true

    EE.emit(VNCConnectedEvt, rfb.current)
    onConnect?.(rfb.current ?? undefined)

    setLoading(false)
  }, [onConnect])

  const _onDisconnect = useCallback((rfbObj?:RFB) => {

    setLoading(true)
    connected.current = false
    onDisconnect?.(rfb?.current || rfbObj || undefined)
    connectRef?.current?.()

  }, [onDisconnect])

  const _onCredentialsRequired = useCallback(() => {
    if (onCredentialsRequired) {
      onCredentialsRequired(rfb?.current ?? undefined)
      return
    }

    const password = rfbOptions?.credentials?.password
    password && rfb?.current?.sendCredentials({ password } as TCredentials)
  }, [])

  const _onDesktopName = useCallback((e:TBrowserDetailEvt) => {
    onDesktopName ? onDesktopName(e) : logger.info(`Desktop name is ${e.detail?.name}`)
  }, [])

  const connect = useConnectCB(props, {
    ...ext,
    _onConnect,
    _onDisconnect,
    _onDesktopName,
    _onCredentialsRequired,
  })

  connectRef.current = connect

  return {
    connect,
    _onConnect,
    _onDisconnect,
    _onDesktopName,
    _onCredentialsRequired
  }

}