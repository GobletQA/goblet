import type RFB from '@novnc/novnc/core/rfb'

import { useRef } from 'react'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { useInline, useOnEvent } from '@gobletqa/components'
import {
  VNCResizeEvt,
  VNCConnectedEvt,
  WindowResizeEvt,
  SetBrowserIsLoadedEvent,
} from '@constants'
import {resizeBrowser} from '@actions/screencast/api/resizeBrowser'
import {TBrowserIsLoadedEvent} from '@types'


export const useLayoutResize = () => {

  const refRef = useRef<RFB|null>(null)

  const onBrowserResize = useInline(async () => {
    if(!refRef.current) return console.warn(`Can not resize browser, missing RFB instance`)

    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: false })
    await resizeBrowser(refRef.current)
    EE.emit<TBrowserIsLoadedEvent>(SetBrowserIsLoadedEvent, { state: true })

  })

  useOnEvent(WindowResizeEvt, async () => onBrowserResize())

  useOnEvent(VNCResizeEvt, async (rfb) => {
    refRef.current = rfb
    onBrowserResize()
  })

  useOnEvent(VNCConnectedEvt, rfb => {
    refRef.current = rfb
    onBrowserResize()
  })

  const onDragEnd = useInline(onBrowserResize)

  return {
    onDragEnd
  }


}