import { useCallback, useRef, useState } from "react"

import Box from '@mui/material/Box'
import { GobletQAUrl } from '@constants'
import { BrowserNav } from './BrowserNav'
import { BrowserIframe } from './BrowserIframe'
import { useWindowResize } from '@hooks/dom/useWindowResize'
import { useIframeURL, useIframeHistory } from './BrowserHooks'
import { useIframeRescale, GB_IFRAME_ID } from '@hooks/dom/useIframeRescale'

export type TBrowser = {
  src?:string
}

const id = `goblet-browser`


export const BrowserComp = (props:TBrowser) => {

  const { src } = props

  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const {
    setUrl,
    iframeUrl,
    currentUrlRef,
  } = useIframeURL({
    inputRef,
    iframeRef,
    setLoading,
    initialUrl: src || GobletQAUrl,
  })
  
  const {
    history,
    position,
    changeUrl,
    canGoBack,
    canGoForward,
    changeHistory,
  } = useIframeHistory({
    setUrl,
    inputRef,
    currentUrlRef,
  })

  const rescaleIframe = useIframeRescale(iframeRef, true)

  useWindowResize({ onResize: rescaleIframe })

  const onIframeLoad = useCallback(() => {
    const iframeWin = iframeRef?.current?.contentWindow
    if(!iframeWin) return

    console.log(`------- iframeWin -------`)
    console.log(iframeWin.location.search)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100%',
        alignItems: 'stretch',
        flexDirection: 'column',
      }}
      className='goblet-browser-container'
    >
      <BrowserNav
        setUrl={setUrl}
        loading={loading}
        history={history}
        position={position}
        inputRef={inputRef}
        changeUrl={changeUrl}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        changeHistory={changeHistory}
        initialUrl={currentUrlRef.current}
      />
      <BrowserIframe
        title={id}
        src={iframeUrl}
        id={GB_IFRAME_ID}
        loading={loading}
        iframeRef={iframeRef}
        onLoad={onIframeLoad}
        setLoading={setLoading}
        referrerPolicy="no-referrer"
        className='goblet-browser-iframe'
        sandbox={"allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"} 
      />
    </Box>
  )
}


export const Browser = (props:TBrowser) => {
  return (<BrowserComp {...props} />)
}