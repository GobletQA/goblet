import type RFB from '@novnc/novnc/core/rfb'
import type { TBrowserIsLoadedEvent, TVncConnected } from '@types'

import { useRef } from 'react'
import { EE } from '@services/sharedService'
import { useInline, useOnEvent } from '@gobletqa/components'
import {
  VNCConnectedEvt,
  WindowResizeEvt,
  SetBrowserIsLoadedEvent,
} from '@constants'
import {resizeBrowser} from '@actions/screencast/api/resizeBrowser'


let resizeTimer:NodeJS.Timeout

export const useLayoutResize = () => {

  const refRef = useRef<RFB|null>(null)

  const onBrowserResize = useInline(async () => {
    if(!refRef.current) return console.warn(`[Warning] Can not resize browser, missing RFB instance`)

    if(!refRef.current._target.isConnected)
      return console.warn(`[Warning] Can not resize the browser. RFB instance is out of date.`)

    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: false })
    await resizeBrowser(refRef.current)
    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: true })

  })

  useOnEvent(WindowResizeEvt, () => onBrowserResize())

  useOnEvent<TVncConnected>(VNCConnectedEvt, ({ rfb }) => {
    resizeTimer && clearTimeout(resizeTimer)

    refRef.current = rfb
    resizeTimer = setTimeout(() => onBrowserResize(), 1000)
  })

  return {
    onDragEnd: onBrowserResize
  }


}