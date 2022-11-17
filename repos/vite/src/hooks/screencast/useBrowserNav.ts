import type { TBrowserProps } from '@types'
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
}

export const useBrowserNav = (props:THBrowserNav) => {
  const { loading, initialUrl } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [navLoading, setNavLoading] = useState(false)
  const [position, setPosition] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([initialUrl])
  
  const [url, setUrl] = useState<string>()

  const updateUrl = useCallback(async (newUrl:string|undefined, type:`input`|`forward`|`backward`) => {
    if(!newUrl || newUrl === url) return console.log(`New URL matches current URL. Ignoring request`)

    setNavLoading(true)
    // Check if position is the last item in the history
    // If not, reset the history starting from the current position
    const newHist = position !== history.length - 1
      ? [...history.slice(0, position + 1), newUrl]
      : [...history, newUrl]

    // Update the history position
    setPosition(newHist.length - 1)

    // Update the history
    setHistory(newHist)

    // Update the url - TODO - Need to make call to API, to update on the server
    setUrl(newUrl)
    
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
    const newUrl = history[pos]

    // Update the browser URL
    updateUrl(newUrl, `backward`)

  }, [history, updateUrl, backButtonActive])

  const onGoForward = useCallback(() => {
    if(!forwardButtonActive) return

    // Update the history position
    const pos = position + 1
    setPosition(pos)

    // Get the url at the new history position
    const newUrl = history[position]

    // Update the browser URL
    updateUrl(newUrl, `forward`)

  }, [history, forwardButtonActive])

  const onReloadPage = useCallback(async () => {
    setNavLoading(true)
    await pageService.reload()
    setNavLoading(false)
  }, [])

  return {
    setUrl,
    history,
    inputRef,
    onGoBack,
    onKeyDown,
    setHistory,
    navLoading,
    onGoForward,
    onChangeUrl,
    onReloadPage,
    backButtonActive,
    forwardButtonActive
  }
  
}