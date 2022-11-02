import type { 
  Dispatch,
  SetStateAction,
  MutableRefObject,
  ComponentProps,
  HTMLAttributeReferrerPolicy
} from 'react'

import { useCallback } from "react"
import { BrowserFrame } from './Browser.styled'
import { useWindowResize } from '@hooks/dom/useWindowResize'
import { useIframeRescale, GB_IFRAME_ID } from '@hooks/dom/useIframeRescale'


export type TBrowserIframe = {
  id?:string
  title?:string
  sandbox?:string
  loading?:boolean
  className?:string
  onLoad?: (...args:any[]) => any
  referrerPolicy?:HTMLAttributeReferrerPolicy
  setLoading: Dispatch<SetStateAction<boolean>>
  iframeRef:MutableRefObject<HTMLIFrameElement | null>
}

export const BrowserIframe = (props:TBrowserIframe) => {

  const {
    onLoad,
    loading,
    iframeRef,
    setLoading,
    ...rest
  } = props

  const rescaleIframe = useIframeRescale(iframeRef, true)

  useWindowResize({ onResize: rescaleIframe })

  const onIframeLoad = useCallback(() => {
    rescaleIframe()
    setLoading(false)
    onLoad?.()
  }, [
    onLoad,
    loading,
    rescaleIframe,
  ])

  return (
    <BrowserFrame
      ref={iframeRef}
      onLoad={onIframeLoad}
      {...rest}
    />
  )
  
}