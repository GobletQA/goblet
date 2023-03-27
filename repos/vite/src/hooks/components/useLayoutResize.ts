import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useRef, useEffect } from 'react'
import { get } from '@keg-hub/jsutils'
import { dims, useEventListen, useEventEmit } from '@gobletqa/components'
import {
  getPanels,
  dimsFromCanvas
} from '@utils/layout'
import {
  VNCResizeEvt,
  VNCRefocusEvent,
  VNCConnectedEvt,
  PanelDimsSetEvt,
} from '@constants'


export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lPPanelRef = useRef<HTMLDivElement|null>(null)
  const rPPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  const onHorResizeMove = useEventEmit(PanelDimsSetEvt, {})

  useEventListen(VNCResizeEvt, () => {
    canvasRef.current
      && lPPanelRef.current
      && rPPanelRef.current
      && dimsFromCanvas({
          canvas: canvasRef.current,
          lPPanel: lPPanelRef.current,
          rPPanel: rPPanelRef.current,
        })
  })

  // Initial setup of the panel and canvas refs
  // Without this the other hooks don't work 
  useEventListen(VNCConnectedEvt, (rfb:RFB) => {
    // When the VNC service connects, get the browser canvas
    // And use it to resize the panels relative to it
    canvasRef.current = get<HTMLCanvasElement>(rfb, `_canvas`)

    const panels = getPanels(parentElRef.current)

    if(!canvasRef.current || !panels || !panels.canvasPanel || !panels.actionsPanel) return

    canvasRef?.current?.setAttribute(`willReadFrequently`, ``)

    // // Store the panels for use in the onResizeMove callbacks
    lPPanelRef.current = panels.lPPanel
    rPPanelRef.current = panels.rPPanel

    dimsFromCanvas({
      canvas: canvasRef.current,
      lPPanel: lPPanelRef.current,
      rPPanel: rPPanelRef.current,
    })
  })


  // HACK - work around bug in chrome causing a reflow issue
  // Works fine in other browsers
  useEventListen(VNCRefocusEvent, () => {
    if(!parentElRef.current) return

    parentElRef.current.style.marginTop = `initial`
    parentElRef.current.style.marginTop = dims.header.hpx
  })

  useEffect(() => {
    parentElRef.current
      &&(parentElRef.current.style.marginTop = dims.header.hpx)
  })

  // ----- END HACK ----- //

  return [
    parentElRef,
    onHorResizeMove,
  ] as [
    MutableRefObject<HTMLDivElement>,
    (event: ResizeMoveEvent) => void,
  ]

}