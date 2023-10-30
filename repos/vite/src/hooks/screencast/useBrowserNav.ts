import type { MutableRefObject } from 'react'
import type { TBrowserIsLoadedEvent } from '@types'

import RFB from '@novnc/novnc/core/rfb'
import { useRef, useCallback } from 'react'
import { useUpdateUrl } from './useUpdateUrl'
import { useBrowserActions } from './useBrowserActions'
import { calcPageSize } from '@utils/browser/calcPageSize'
import {restartBrowserContext} from '@actions/socket/api/restartBrowserContext'


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


  const onReconnect = useCallback(async () => {
    const size = calcPageSize(rfbRef.current)
    restartBrowserContext({
      context: {
        screen: size,
        viewport: size
      }
    }, true)
  }, [])

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