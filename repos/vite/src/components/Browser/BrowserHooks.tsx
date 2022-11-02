
import type { MutableRefObject } from 'react'

import { useCallback, useEffect, useRef, useState } from "react"
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

  const updateUrl = useCallback(async (newUrl: string) => {
    const { contentWindow } = iframeRef?.current || {}
    if(!contentWindow?.location) return

    setLoading(true)
    const addressUrl = await getUrlOrSearch(newUrl)
    
    console.log(`------- addressUrl -------`)
    console.log(addressUrl)
    
    currentUrlRef.current = addressUrl
    contentWindow.location.replace(addressUrl)

  }, [currentUrlRef.current])

  const changeUrl = useCallback((newUrl?: string) => {
    const newVal = newUrl || inputRef?.current?.value
    newVal && newVal !== currentUrlRef.current && updateUrl(newVal)
  }, [currentUrlRef.current, updateUrl])

  return {
    changeUrl,
    currentUrlRef,
    setUrl:updateUrl,
  }
}

export type THIframeHistory = {
  changeUrl: (url:string) => any
  currentUrlRef:MutableRefObject<string>
  setUrl: (newUrl: string) => Promise<void>
  inputRef?:MutableRefObject<HTMLInputElement | null>
}

export const useIframeHistory = ({
  setUrl,
  inputRef,
  changeUrl,
  currentUrlRef
}:THIframeHistory) => {

  const [currentUrl, setCurrentUrl] = useState(currentUrlRef.current)
  const [history, setHistory] = useState<string[]>(() => [currentUrl])
  const [position, setPosition] = useState<number>(0)

  const moveHistory = useCallback((step: number): void => {
    const newPosition = position + step

    setPosition(newPosition)
    const newUrl = history[newPosition]
    setCurrentUrl(newUrl)
    changeUrl(newUrl)
  }, [
    history,
    position,
    changeUrl,
  ])

  const changeHistory = useCallback((step: number): void => {
    moveHistory(step)
    if (inputRef?.current) inputRef.current.value = history[position + step]
  }, [
    history,
    position,
    moveHistory,
  ])

  useEffect(() => {
    if(currentUrlRef.current === currentUrl) return

    setPosition(position + 1)
    setCurrentUrl(currentUrlRef.current)
    setHistory([...history.slice(0, position + 1), currentUrlRef.current])

  }, [
    history,
    position,
    currentUrl,
  ])

  useEffect(() => {
    const historyUrl = history[position]
    if(!historyUrl || historyUrl === currentUrlRef.current) return

    currentUrlRef.current = history[position]
    setUrl(history[position])
  }, [
    setUrl,
    history,
    position,
  ])


  return {
    history,
    position,
    moveHistory,
    changeHistory,
    canGoBack: position > 0,
    canGoForward: position < history.length - 1,
  }
}
