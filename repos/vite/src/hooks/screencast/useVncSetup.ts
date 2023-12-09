import {
  TBrowserExt,
  TCredentials,
  TBrowserProps,
  TVncConnected,
  TBrowserDetailEvt,
  EAppStatus,
} from '@types'

import { useApp } from "@store"
import { useCallback } from 'react'
import RFB from '@novnc/novnc/core/rfb'
import { EE } from '@services/sharedService'
import { VNCConnectedEvt } from '@constants'
import { useRFBConfig } from './useRFBConfig'
import {useInline} from '@gobletqa/components'

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

  const { status } = useApp()

  const _onConnect = useCallback((...args:any[]) => {
    connected.current = true
    EE.emit<TVncConnected>(VNCConnectedEvt, { rfb: rfb.current })
    onConnect?.(rfb.current ?? undefined)
    setLoading(false)
  }, [onConnect])

  const _onDisconnect = useInline((rfbObj?:RFB) => {

    setLoading(true)
    connected.current = false
    onDisconnect?.(rfb?.current || rfbObj || undefined)

    status === EAppStatus.Active
      && connectRef?.current?.()

  })

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