import type RFB from '@novnc/novnc/core/rfb'
import type {
  TBrowserHandle,
  TGlobalCopyEvent,
  TBrowserDetailEvt,
  TBrowserIsLoadedEvent,
} from '@types'


import { isMac } from '@utils/browser/getOS'
import { Clipboard } from '@gobletqa/components'
import { useOnEvent } from '@gobletqa/components/hooks/useEvent'
import { useRef, useCallback, useState, useEffect } from 'react'
import { GlobalCopyEvt, SetBrowserIsLoadedEvent } from '@constants'
import { useScreencastUrl }  from '@hooks/screencast/useScreencastUrl'
import { useCheckBrowserStatus } from '@hooks/screencast/useCheckBrowserStatus'

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


  useOnEvent<TGlobalCopyEvent>(GlobalCopyEvt, ({ text }) => vncRef?.current?.clipboardPaste(text))

  useOnEvent<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, ({ state }) => {
    state !== isLoaded && setIsLoaded(state)
  })

  const onKeyDown = useCallback((event:KeyboardEvent) => {
    const isT = event.code === `KeyT` || event.key === `t` || event.keyCode === 84
    const isTab = event.code === `Tab` || event.key === `Tab` || event.keyCode === 9

    if((isT || isTab) && (event.ctrlKey || event.metaKey || event.altKey)){
      event.stopPropagation()
      event.preventDefault()
      console.warn(`Command not allowed`)
    }

    // Check if on mac, and if so, map the metaKey to the ctrlKey
    // The vnc browser runs in linux, which uses the ctrlKey instead of the metaKey (command key on mac)
    if(isMac() && (event.metaKey)){
      const isC = event.code === `KeyC` || event.key === `c` || event.keyCode === 67
      const isV = event.code === `KeyV` || event.key === `v` || event.keyCode === 86

      if(isC || isV){
        // @ts-ignore
        const sendEvt = new event.constructor(event.type, {
          ...event,
          metaKey: false,
          ctrlKey: true,
          bubbles: true,
          composed: true,
          cancelable: true,
          key: event.key,
          code: event.code,
          view: event.view,
          which: event.which,
          keyCode: event.keyCode,
          returnValue: event.returnValue,
          // @ts-ignore
          sourceCapabilities: event.sourceCapabilities
        })

        // Stop the original event
        event.stopPropagation()
        event.preventDefault()

        return event?.target?.dispatchEvent(sendEvt)
      }

    }

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