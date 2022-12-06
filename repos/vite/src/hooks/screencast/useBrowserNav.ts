import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'

import { pageService } from '@services/pageService'

import {
  useRef,
  useMemo,
  useState,
  useCallback
} from 'react'

export type THBrowserNav = {
  loading:boolean
  initialUrl:string
  rfbRef:MutableRefObject<RFB | null>
}

export const useBrowserNav = (props:THBrowserNav) => {
  const { rfbRef, loading, initialUrl } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [navLoading, setNavLoading] = useState(false)
  const [position, setPosition] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([initialUrl])
  
  const [url, setUrl] = useState<string>()

  const updateUrl = useCallback(async (newUrl:string|undefined, type:`input`|`forward`|`backward`) => {
    if(!newUrl || newUrl === url) return console.log(`New URL matches current URL. Ignoring request`)
    setNavLoading(true)

    if(type === `input`){
      // Check if position is the last item in the history
      // If not, reset the history starting from the current position
      const newHist = position !== history.length - 1
        ? [...history.slice(0, position + 1), newUrl]
        : [...history, newUrl]

      // Update the history position
      setPosition(newHist.length - 1)

      // Update the history
      setHistory(newHist)
    }

    // Update the url directly on the input
    // And update the save state
    inputRef.current && (inputRef.current.value = newUrl)
    ;setUrl(newUrl)

    // Finally, call the backend to update to the new url in the screencast browser
    await pageService.goto(newUrl)

    setNavLoading(false)
  }, [url, history, position])

  const onChangeUrl = useCallback(() => {
    updateUrl(inputRef?.current?.value, `input`)
  }, [url, updateUrl, history])

  const onKeyDown = useCallback(({ key }:Record<'key', string>) => {
    if(!inputRef?.current || key !== "Enter") return

    const newUrl = inputRef?.current?.value
    window.getSelection()?.removeAllRanges()
    inputRef.current.blur()

    updateUrl(newUrl, `input`)
  }, [])

  const backButtonActive = useMemo(() => {
    return !loading && !navLoading && Boolean(history[position - 1])
  }, [loading, navLoading, history, position])

  const forwardButtonActive = useMemo(() => {
    return !loading && !navLoading && Boolean(history[position + 1])
  }, [loading, navLoading, history, position])

  const onGoBack = useCallback(() => {
    if(!backButtonActive) return

    // Update the history position
    const pos = position - 1
    setPosition(pos)

    // Get the url at the new history position
    // Update the browser URL
    const newUrl = history[pos]
    updateUrl(newUrl, `backward`)

  }, [history, updateUrl, backButtonActive])

  const onGoForward = useCallback(() => {
    if(!forwardButtonActive) return

    // Update the history position
    const pos = position + 1
    setPosition(pos)

    // Get the url at the new history position
    // Update the browser URL
    const newUrl = history[pos]
    updateUrl(newUrl, `forward`)

  }, [history, forwardButtonActive])

  const onReloadPage = useCallback(async () => {
    setNavLoading(true)
    await pageService.reload()
    setNavLoading(false)
  }, [])

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
    setUrl,
    history,
    inputRef,
    onGoBack,
    onKeyDown,
    setHistory,
    navLoading,
    onGoForward,
    onChangeUrl,
    onReconnect,
    onReloadPage,
    backButtonActive,
    forwardButtonActive
  }
  
}