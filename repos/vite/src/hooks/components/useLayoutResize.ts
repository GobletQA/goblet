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


export const useLayoutResize = () => {

  const refRef = useRef<RFB|null>(null)

  const onBrowserResize = useInline(async () => {
    if(!refRef.current) return console.warn(`Can not resize browser, missing RFB instance`)

    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: false })
    await resizeBrowser(refRef.current)
    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: true })

  })

  useOnEvent(WindowResizeEvt, () => onBrowserResize())

  useOnEvent<TVncConnected>(VNCConnectedEvt, ({ rfb }) => {
    refRef.current = rfb
    setTimeout(() => onBrowserResize(), 1000)
  })

  return {
    onDragEnd: onBrowserResize
  }


}