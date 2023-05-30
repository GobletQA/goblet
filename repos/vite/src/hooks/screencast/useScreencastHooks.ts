import type RFB from '@novnc/novnc/core/rfb'
import type { TGlobalCopyEvent, TBrowserDetailEvt, TBrowserHandle } from '@types'

import { useOnEvent } from '@gobletqa/components/hooks/useEvent'
import { useRef, useCallback, useState, useEffect } from 'react'
import { Clipboard } from '@gobletqa/shared/frontend/dom/clipBoard'
import { useScreencastUrl }  from '@hooks/screencast/useScreencastUrl'
import { useCheckBrowserStatus } from '@hooks/screencast/useCheckBrowserStatus'
import { GlobalCopyEvt, ResetBrowserLoadingEvent, ShowBrowserLoadingEvent } from '@constants'


const useDelayCallback = (method:(...args:any[]) => void, delay:number=2000) => {
  return useCallback((...args:any[]) => setTimeout(() => method?.(...args), delay), [method, delay])
}

export const useScreencastHooks = () => {
  const vncRef = useRef<TBrowserHandle>(null)
  const screencastUrl = useScreencastUrl()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if(!vncRef?.current) return

    const Vnc = vncRef.current
    if(Vnc.connected) return

    Vnc.connect()

  }, [screencastUrl])

  const delayFadeState = useDelayCallback(setIsLoaded)
  const [checkStatus, repoUrl] = useCheckBrowserStatus(delayFadeState)

  const onConnect = useCallback(async (...args:any[]) => {
    await checkStatus?.()
  }, [checkStatus])

  const onDisconnect = useCallback(async (rfb?:RFB) => {
    !vncRef.current?.screen?.current?.childNodes?.length
      && setIsLoaded(false)

  }, [checkStatus])

  const onClipboard = useCallback(async (evt?:TBrowserDetailEvt) => {
    const text = evt?.detail?.text
    text && await Clipboard.copyText(text)
  }, [])


  useOnEvent(ResetBrowserLoadingEvent, ({}) => setIsLoaded(false))
  useOnEvent<TGlobalCopyEvent>(GlobalCopyEvt, ({ text }) => vncRef?.current?.clipboardPaste(text))

  const onKeyDown = useCallback((event:Event) => {
    // TODO: add check here for it on mac
    // Re-Map the keys command / ctrl keys if possible
    // Have to use ctl when on vnc screen
    // event.stopPropagation()
    // event.preventDefault()
  }, [])

  return {
    vncRef,
    repoUrl,
    isLoaded,
    onConnect,
    onKeyDown,
    onClipboard,
    onDisconnect,
    setIsLoaded,
    screencastUrl,
  }

}