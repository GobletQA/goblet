import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { TGobletSettings, TBrowserIsLoadedEvent, TVncConnected } from '@types'

import { useRef, useCallback } from 'react'
import { EE } from '@services/sharedService'
import { useOnEvent } from '@gobletqa/components'
import {useSettingValues} from '@hooks/settings/useSettingValues'
import {resizeBrowser} from '@actions/screencast/api/resizeBrowser'
import {
  VNCConnectedEvt,
  WindowResizeEvt,
  SetBrowserIsLoadedEvent,
} from '@constants'


let resizeTimer:NodeJS.Timeout|undefined
let retryTimer:NodeJS.Timeout|undefined


const resizeFromRfb = async (rfbRef:MutableRefObject<RFB | null>, retry=0) => {
  if(!rfbRef.current){
    retryTimer && clearTimeout(retryTimer)
    retryTimer = undefined

    if(retry < 3){
      console.log(`[Warning] Can not resize browser, missing RFB instance. Retry in 3 seconds...`)
      retryTimer = setTimeout(() => resizeFromRfb(rfbRef, retry + 1), 3000)
    }
    else console.log(`[Warning] Can not resize browser, missing RFB instance.`)

    return
  }

  if(!rfbRef.current._target.isConnected)
    return console.warn(`[Warning] Can not resize the browser. RFB instance is out of date.`)

  EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: false })
  await resizeBrowser(rfbRef.current)
  EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: true })
}

export const useLayoutResize = () => {

  const rfbRef = useRef<RFB|null>(null)
  const { browserInBrowser } = useSettingValues<TGobletSettings>(`goblet`)

  const onBrowserResize = useCallback(
    async () => browserInBrowser && resizeFromRfb(rfbRef),
    [browserInBrowser]
  )

  useOnEvent(WindowResizeEvt, () => onBrowserResize())

  useOnEvent<TVncConnected>(VNCConnectedEvt, ({ rfb }) => {
    resizeTimer && clearTimeout(resizeTimer)
    resizeTimer = undefined

    rfbRef.current = rfb
    resizeTimer = setTimeout(() => onBrowserResize(), 1000)
  })

  return {
    onDragEnd: onBrowserResize
  }


}