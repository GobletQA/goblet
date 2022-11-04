
import type { MutableRefObject } from 'react'

import { useCallback, useEffect, useRef, useState, useMemo } from "react"
import { getUrlOrSearch } from '@utils/components/getUrlOrSearch'

export type THIframeUrl = {
  initialUrl:string,
  setLoading: (loading:boolean) => any
  inputRef?:MutableRefObject<HTMLInputElement | null>
  iframeRef?:MutableRefObject<HTMLIFrameElement | null>
}

export const useIframeURL = ({
  inputRef,
  iframeRef,
  initialUrl,
  setLoading,
}:THIframeUrl) => {
  
  const currentUrlRef = useRef(new URL(initialUrl).href)
  const { iframeUrl } = useMemo(() => getUrlOrSearch(initialUrl), [initialUrl])

  const setUrl = useCallback((newUrl: string) => {

    const { contentWindow } = iframeRef?.current || {}
    if(!contentWindow?.location) return

    setLoading(true)
    const { addressUrl, iframeUrl } = getUrlOrSearch(newUrl)
    currentUrlRef.current = addressUrl
    contentWindow.location.replace(iframeUrl)

  }, [currentUrlRef.current])


  return {
    setUrl,
    iframeUrl,
    currentUrlRef,
  }
}

export type THIframeHistory = {
  setUrl: (newUrl: string) => void
  currentUrlRef:MutableRefObject<string>
  inputRef?:MutableRefObject<HTMLInputElement | null>
}

export const useIframeHistory = ({
  setUrl,
  inputRef,
  currentUrlRef
}:THIframeHistory) => {

  const [currentUrl, setCurrentUrl] = useState(currentUrlRef.current)
  const [history, setHistory] = useState<string[]>([currentUrl])
  const [position, setPosition] = useState<number>(0)

  const changeUrl = useCallback((newUrl?: string) => {
    const value = (newUrl || inputRef?.current?.value) as string
    const updatedHist = [...history, value]
    setHistory(updatedHist)
    setPosition(updatedHist.length - 1)

    setUrl(value)
  }, [currentUrlRef.current, setUrl, history, position])

  const changeHistory = useCallback((step: number): void => {
    const newPosition = position + step
    setPosition(newPosition)
    const newUrl = history[newPosition]
    if (inputRef?.current) inputRef.current.value = newUrl
    setCurrentUrl(newUrl)
    setUrl(newUrl)
  }, [
    setUrl,
    history,
    position,
  ])

  return {
    history,
    position,
    changeUrl,
    changeHistory,
    canGoBack: position > 0,
    canGoForward: position < history.length - 1,
  }
}
