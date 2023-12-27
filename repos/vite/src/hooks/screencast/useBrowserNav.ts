import type { MutableRefObject } from 'react'

import { useApp } from '@store'
import RFB from '@novnc/novnc/core/rfb'
import { useRef, useCallback } from 'react'
import { useUpdateUrl } from './useUpdateUrl'
import { useBrowserActions } from './useBrowserActions'
import { calcPageSize } from '@utils/browser/calcPageSize'
import { toggleInspector } from '@actions/app/toggleInspector'
import {restartBrowserContext} from '@actions/socket/api/restartBrowserContext'


export type THBrowserNav = {
  loading:boolean
  initialUrl:string
  rfbRef:MutableRefObject<RFB | null>
}

export const useBrowserNav = (props:THBrowserNav) => {
  const {
    rfbRef,
    loading,
    initialUrl
  } = props

  const { inspector } = useApp()
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    onGoBack,
    onKeyDown,
    backAmount,
    navLoading,
    onGoForward,
    onReloadPage,
    setBackAmount,
    backButtonActive,
    forwardButtonActive
  } = useBrowserActions({
    loading,
    inputRef,
    initialUrl,
  })

  const { url } = useUpdateUrl({
    inputRef,
    initialUrl,
    backAmount,
    setBackAmount,
  })

  const onReconnect = useCallback(async () => {
    if(!rfbRef.current) return console.warn(`[Warning] Can not reconnect browser, missing RFB instance`)

    if(!rfbRef.current._target.isConnected)
      return console.warn(`[Warning] Can not reconnect the browser. RFB instance is out of date.`)

    const size = calcPageSize(rfbRef.current)
    restartBrowserContext({
      context: {
        screen: size,
        viewport: size
      }
    }, true)
  }, [])

  const onBrowserSettings = useCallback(() => toggleInspector(!inspector), [inspector])
 
  return {
    url,
    history,
    inputRef,
    onGoBack,
    onKeyDown,
    navLoading,
    onGoForward,
    onReconnect,
    onReloadPage,
    backButtonActive,
    onBrowserSettings,
    forwardButtonActive
  }
  
}