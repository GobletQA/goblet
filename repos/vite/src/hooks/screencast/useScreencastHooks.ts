import type RFB from '@novnc/novnc/core/rfb'
import type { TGlobalCopyEvent, TBrowserDetailEvt, TBrowserHandle } from '@types'

import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import { GlobalCopyEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { Clipboard } from '@gobletqa/shared/frontend/dom/clipBoard'
import { useScreencastUrl }  from '@hooks/screencast/useScreencastUrl'
import { useCheckBrowserStatus } from '@hooks/screencast/useCheckBrowserStatus'


const useDelayCallback = (method:(...args:any[]) => void, delay:number=2000) => {
  return useCallback((...args:any[]) => setTimeout(() => method?.(...args), delay), [method, delay])
}

export const useScreencastHooks = () => {
  const vncRef = useRef<TBrowserHandle>(null)
  const screencastUrl = useScreencastUrl()
  const [fadeStart, setFadeStart] = useState<boolean>(false)

  useEffect(() => {
    if(!vncRef?.current) return

    const Vnc = vncRef.current
    if(Vnc.connected) return

    Vnc.connect()

  }, [screencastUrl])

  const delayFadeState = useDelayCallback(setFadeStart)
  const [checkStatus, repoUrl] = useCheckBrowserStatus(delayFadeState)

  const onConnect = useCallback(async (...args:any[]) => {
    await checkStatus?.()
  }, [checkStatus])


  const onDisconnect = useCallback(async (rfb?:RFB) => {
    const Vnc = vncRef.current
    if(!Vnc || !Vnc.screen?.current?.childNodes.length){
      setFadeStart(false)
      return setTimeout(() => checkStatus?.(), 3000)
    }
    // TODO: need to figure out other disconnect scenarios and handle them gracefully
  }, [checkStatus])


  const onError = useCallback(async (evt?:any) => {
    // TODO figure out how to capture the browser error
    // Then force a reload
    console.log(`------- on browser error -------`)
  }, [])

  const onClipboard = useCallback(async (evt?:TBrowserDetailEvt) => {
    const text = evt?.detail?.text
    text && await Clipboard.copyText(text)
  }, [])


  useEffect(() => {
    EE.on<TGlobalCopyEvent>(GlobalCopyEvt, ({ text }) => {
      vncRef?.current?.clipboardPaste(text)
    }, GlobalCopyEvt)

    return () => {
      EE.off<TGlobalCopyEvent>(GlobalCopyEvt)
    }
  }, [])

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
    onError,
    fadeStart,
    onConnect,
    onKeyDown,
    onClipboard,
    onDisconnect,
    setFadeStart,
    screencastUrl,
  }

}