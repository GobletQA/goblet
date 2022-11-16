import type { TBrowserProps } from '@types'

import {
  useRef,
  useMemo,
  useState,
  useCallback
} from 'react'

  // initialUrl: string
  // loading: boolean

  

export type THBrowserNav = {
  loading:boolean
  initialUrl:string
}

export const useBrowserNav = (props:THBrowserNav) => {
  const { loading, initialUrl } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const [position, setPosition] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([initialUrl])
  
  const [url, setUrl] = useState<string>()

  const updateUrl = useCallback((newUrl:string|undefined, type:`input`|`forward`|`backward`) => {
    if(!newUrl || newUrl === url) return console.log(`New URL matches current URL. Ignoring request`)

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
  }, [url, history, position])

  const onChangeUrl = useCallback(() => {
    updateUrl(inputRef?.current?.value, `input`)
  }, [url, updateUrl, history])

  const onKeyDown = useCallback(({ key }:Record<'key', string>) => {
    if(!inputRef?.current || key !== "Enter") return

    updateUrl(inputRef?.current?.value, `input`)
    window.getSelection()?.removeAllRanges()
    inputRef.current.blur()
  }, [])

  const backButtonActive = useMemo(() => {
    return !loading && Boolean(history[position - 1])
  }, [loading, history, position])

  const forwardButtonActive = useMemo(() => {
    return !loading && Boolean(history[position + 1])
  }, [loading, history, position])


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

  return {
    setUrl,
    history,
    inputRef,
    onGoBack,
    onKeyDown,
    setHistory,
    onGoForward,
    onChangeUrl,
    backButtonActive,
    forwardButtonActive
  }
  
}