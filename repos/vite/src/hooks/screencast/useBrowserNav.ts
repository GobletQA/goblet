import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { useRef, useCallback } from 'react'
import { useUpdateUrl } from './useUpdateUrl'
import { useBrowserActions } from './useBrowserActions'

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
    if(!rfbRef?.current) return

    /**
     * RFB._connect is an internal method, so it does not exist on the RFB type
     * Technically we only need this in dev, so using is should not be an issue
     */
    // @ts-ignore
    rfbRef.current?._connect
      // @ts-ignore
      ? rfbRef.current?._connect?.()
      : console.warn(`NoVNC RFB._connect method does not exist. Can not reconnect`)

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