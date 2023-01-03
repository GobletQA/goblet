import type { RefObject } from 'react'

import {
  useMemo,
  useState,
  useCallback
} from 'react'
import { pageService } from '@services/pageService'

export type THBrowserActions = {
  loading:boolean
  initialUrl:string
  inputRef:RefObject<HTMLInputElement>
}

export const useBrowserActions = (props:THBrowserActions) => {

  const {
    loading,
    inputRef,
  } = props

  const [navLoading, setNavLoading] = useState(false)

  const [backAmount, setBackAmount] = useState<number>(0)
  const [forwardAmount, setForwardAmount] = useState<number>(0)

  const onKeyDown = useCallback(async ({ key }:Record<'key', string>) => {
    if(!inputRef?.current || key !== `Enter`) return

    const newUrl = pageService.normalize(inputRef?.current?.value)
    window.getSelection()?.removeAllRanges()
    inputRef.current.blur()
    // When the url is directly added, reset the forward amount
    setForwardAmount(0)

    setNavLoading(true)
    await pageService.goto(newUrl)
    setNavLoading(false)
  }, [])

  const onReloadPage = useCallback(async () => {
    setNavLoading(true)
    await pageService.reload()
    setNavLoading(false)
  }, [])

  const backButtonActive = useMemo(
    () => !loading && !navLoading && backAmount !== 0,
    [loading, navLoading, backAmount]
  )
  const forwardButtonActive = useMemo(
    () => !loading && !navLoading && forwardAmount !== 0,
    [loading, navLoading, forwardAmount]
  )

  const onGoBack = useCallback(
    async () => {
      if(!backButtonActive) return
      
      setForwardAmount(forwardAmount + 1)
      setBackAmount(backAmount - 1)

      setNavLoading(true)
      await pageService.goBack()
      setNavLoading(false)
    },
    [backAmount, forwardAmount, backButtonActive]
  )

  const onGoForward = useCallback(
    async () => {
      if(!forwardButtonActive) return
      
      setForwardAmount(forwardAmount - 1)
      setBackAmount(backAmount + 1)

      setNavLoading(true)
      await pageService.goForward()
      setNavLoading(false)
    },
    [backAmount, forwardAmount, forwardButtonActive]
  )

  return {
    onGoBack,
    onKeyDown,
    backAmount,
    navLoading,
    onGoForward,
    onReloadPage,
    setNavLoading,
    setBackAmount,
    backButtonActive,
    forwardButtonActive
  }

}