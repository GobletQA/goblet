import type {
  TBrowserExt,
  TCredentials,
  TBrowserProps,
  TBrowserDetailEvt,
} from '@types'

import { useCallback } from 'react'
import { get } from '@keg-hub/jsutils'
import RFB from '@novnc/novnc/core/rfb'
import { VNCConnectedEvt } from '@constants'
import { useRFBConfig } from './useRFBConfig'
import { useInline } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { isCanvasBlank } from '@utils/components/isCanvasBlank'

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


  /**
   * Loop function to check for when the canvas has content
   * This ensures the onConnect method is not fired
   * Until content is actually rendered to the browser canvas
   */
  const loopOnCanvas = useInline((
    rfb:RFB|null,
    onConnect?:(rfb?: RFB) => void,
    check:number=1
  ):unknown => {
    if(!rfb) return console.warn(`RFB no passed to browsers onConnect method`)

    // Ensure we kill the loop if canvas check keeps failing
    if(check > 1000)  return console.warn(`Could not load Browser Canvas`)

    const canvas = get<HTMLCanvasElement>(rfb, `_canvas`)
    const isBlank = isCanvasBlank(canvas)

    if(isBlank)
      return setTimeout(() => loopOnCanvas(rfb, onConnect, check + 1), 500)

    onConnect?.(rfb)
    EE.emit(VNCConnectedEvt, rfb)
  })

  const _onConnect = useCallback((...args:any[]) => {
    connected.current = true
    // loopOnCanvas(rfb.current, onConnect)
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