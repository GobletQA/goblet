import type { MutableRefObject } from 'react'

import RFB from '@novnc/novnc/core/rfb'
import { useRef, useCallback } from 'react'
import { useUpdateUrl } from './useUpdateUrl'
import { useBrowserActions } from './useBrowserActions'
import {restartBrowser} from '@actions/screencast/api/restartBrowser'

export type THBrowserNav = {
  loading:boolean
  initialUrl:string
  rfbRef:MutableRefObject<RFB | null>
}

export const useBrowserNav = (props:THBrowserNav) => {
  const { rfbRef, loading, initialUrl } = props
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


  const onReconnect = useCallback(async () => await restartBrowser(), [])

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
    forwardButtonActive
  }
  
}