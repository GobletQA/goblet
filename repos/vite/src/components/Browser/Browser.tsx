
import Box from '@mui/material/Box'
import useHistory from './useHistory'

import { GobletQAUrl } from '@constants'
import { BrowserNav } from './BrowserNav'
import { BrowserIframe } from './BrowserIframe'
import { useWindowResize } from '@hooks/dom/useWindowResize'
import { useProcesses, ProcessProvider } from './useProcesses'
import { useCallback, useEffect, useRef, useState } from "react"
import { getUrlOrSearch } from '@utils/components/getUrlOrSearch'
import { useIframeRescale, GB_IFRAME_ID } from '@hooks/dom/useIframeRescale'

export type TBrowser = {}

const id = `goblet-browser`
export const BrowserComp = (props:TBrowser) => {
  const {
    url: changeUrl,
    processes: { [id]: process },
  } = useProcesses()

  const { url = "" } = process || {}
  const initialUrl = url || GobletQAUrl
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const {
    history,
    position,
    canGoBack,
    moveHistory,
    canGoForward,
  } = useHistory(initialUrl, id)

  const changeHistory = (step: number): void => {
    moveHistory(step)
    if (inputRef.current) inputRef.current.value = history[position + step]
  }

  const currentUrl = useRef("")
  const setUrl = useCallback(
    async (addressInput: string): Promise<void> => {
      const { contentWindow } = iframeRef.current || {}
      if(!contentWindow?.location) return

      setLoading(true)
      const addressUrl = await getUrlOrSearch(addressInput)
      contentWindow.location.replace(addressUrl)
    },
    []
  )

  useEffect(() => {
    if (history[position] !== currentUrl.current) {
      currentUrl.current = history[position]
      setUrl(history[position])
    }
  }, [history, position, setUrl])

  const rescaleIframe = useIframeRescale(iframeRef, true)

  useWindowResize({ onResize: rescaleIframe })

  const onIframeLoad = useCallback(() => {
    rescaleIframe()
    setLoading(false)
  }, [rescaleIframe, loading])

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
        initialUrl={initialUrl}
        canGoForward={canGoForward}
        changeHistory={changeHistory}
      />
      <BrowserIframe
        title={id}
        loading={loading}
        id={GB_IFRAME_ID}
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
  return (
    <ProcessProvider>
      <BrowserComp {...props} />
    </ProcessProvider>
  )
}
