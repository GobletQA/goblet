import type {
  TCanvasExt,
  TConnectExt,
  TCanvasProps,
  TCredentials,
} from '@types'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'


export const useConnectCB = (props:TCanvasProps, ext:TConnectExt) => {
  const {
    url,
    onBell,
    viewOnly,
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
      if (!url || (connected.current && !!rfb)) disconnectRef?.current?.()

      if (!screen.current)
        return console.warn(`Error loading browser. Dom Element could not be found.`)

      screen.current.innerHTML = ''
      const _rfb = new RFB(screen.current, url, rfbOptions)

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

      connected.current = true
    }
    catch (err) {
      logger.error(err)
    }
  }, [
    url,
    onBell,
    viewOnly,
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

export const useVncHooks = (props:TCanvasProps, ext:TCanvasExt) => {
  const {
    onConnect,
    rfbOptions,
    onDisconnect,
    onDesktopName,
    retryDuration=3000,
    onCredentialsRequired,
  } = props

  const {
    rfb,
    logger,
    timeouts,
    connected,
    connectRef,
    setLoading,
  } = ext

  const _onConnect = useCallback(() => {
    if (onConnect) {
      onConnect?.(rfb.current ?? undefined)
      setLoading(false)
      return
    }

    logger.info('Connected to remote VNC.')
    setLoading(false)
  }, [onConnect])

  const _onDisconnect = useCallback(() => {
    if (onDisconnect) {
      onDisconnect?.(rfb?.current ?? undefined)
      setLoading(true)
      return
    }

    if (connected.current) {
      // connected.current = true
      logger.info(`Disconnected from VNC server, Attempting to reconnect in ${retryDuration / 1000} seconds.`)
      timeouts.current.push(setTimeout(() => connectRef?.current?.(), retryDuration))
    }
    else logger.info(`Disconnected from remote VNC.`)

    setLoading(true)
  }, [onDisconnect])

  const _onCredentialsRequired = useCallback(() => {
    if (onCredentialsRequired) {
      onCredentialsRequired(rfb?.current ?? undefined)
      return
    }

    const password = rfbOptions?.credentials?.password
    password && rfb?.current?.sendCredentials({ password } as TCredentials)
  }, [])

  const _onDesktopName = useCallback((e: { detail: { name: string } }) => {
    onDesktopName ? onDesktopName(e) : logger.info(`Desktop name is ${e.detail.name}`)
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