import type {
  TBrowserExt,
  TCredentials,
  TBrowserProps,
  TVncConnected,
  TBrowserDetailEvt,
} from '@types'

import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { VNCConnectedEvt } from '@constants'
import { useRFBConfig } from './useRFBConfig'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const useVncSetup = (props:TBrowserProps, ext:TBrowserExt) => {
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
    EE.emit<TVncConnected>(VNCConnectedEvt, { rfb: rfb.current })
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

  const connect = useRFBConfig(props, {
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