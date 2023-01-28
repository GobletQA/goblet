import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useRef } from 'react'
import { get } from '@keg-hub/jsutils'
import { useEventListen, useEventEmit } from '@gobletqa/components'
import {
  getPanels,
  dimsFromCanvas
} from '@utils/layout'
import {
  VNCResizeEvt,
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

    // Store the panels for use in the onResizeMove callbacks
    lPPanelRef.current = panels.lPPanel
    rPPanelRef.current = panels.rPPanel

    dimsFromCanvas({
      canvas: canvasRef.current,
      lPPanel: lPPanelRef.current,
      rPPanel: rPPanelRef.current,
    })
  })

  return [
    parentElRef,
    onHorResizeMove,
  ] as [
    MutableRefObject<HTMLDivElement>,
    (event: ResizeMoveEvent) => void,
  ]

}