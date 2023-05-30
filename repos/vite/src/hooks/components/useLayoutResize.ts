import type RFB from '@novnc/novnc/core/rfb'

import { useRef } from 'react'
import { useInline, useOnEvent } from '@gobletqa/components'
import {
  VNCResizeEvt,
  VNCConnectedEvt,
  WindowResizeEvt,
} from '@constants'
import {resizeBrowser} from '@actions/screencast/api/resizeBrowser'


export const useLayoutResize = () => {

  const refRef = useRef<RFB|null>(null)

  const onBrowserResize = useInline(async () => {
    refRef.current
      ? await resizeBrowser(refRef.current)
      : console.warn(`Can not resize browser, missing RFB instance`)
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