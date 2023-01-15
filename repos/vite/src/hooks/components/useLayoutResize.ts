import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useRef } from 'react'
import { get } from '@keg-hub/jsutils'
import { useInline } from '@gobletqa/components'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  getPanels,
  panelDimsFromCanvas,
  parentDimsFromCanvas
} from '@utils/components/layoutHelpers'
import {
  VNCResizeEvt,
  VNCConnectedEvt,
  PanelDimsSetEvt,
} from '@constants'


export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const canvasPanelRef = useRef<HTMLDivElement|null>(null)
  const lPPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  const onHorResizeMove = useInline(() => {
    EE.emit(PanelDimsSetEvt, { canvasPanel: canvasPanelRef.current })
  })

  const onVerResizeMove = useInline(() => {
    lPPanelRef.current && canvasPanelRef.current && canvasRef.current
      ? parentDimsFromCanvas({
          canvas: canvasRef.current,
          lPPanel: lPPanelRef.current,
          canvasPanel: canvasPanelRef.current,
        })
      : console.warn(
          `Layout-Resize - Horizontal Panel Refs not set`,
          canvasRef.current,
          canvasPanelRef.current,
          lPPanelRef.current,
        )
  })

  // Listen to external resize events, like window?
  // Then resizes the panels
  useEffectOnce(() => {
    const off = EE.on<RFB>(
      VNCResizeEvt,
      () => EE.emit(PanelDimsSetEvt, { canvasPanel: canvasPanelRef.current }),
    )

    return () => {
      off?.()
    }
  })

  // Initial setup of the panel and canvas refs
  // Without this the other hooks don't work 
  useEffectOnce(() => {
    // When the VNC service connects, get the browser canvas
    // And use it to resize the panels relative to it
    const off = EE.on<RFB>(VNCConnectedEvt, (rfb) => {
      
      console.log(`------- rfb -------`)
      console.log(rfb)
      
      canvasRef.current = get<HTMLCanvasElement>(rfb, `_canvas`)
      const panels = getPanels(parentElRef.current)

      if(!canvasRef.current || !panels || !panels.canvasPanel) return

      panels.canvasPanel.style.overflow = `hidden`
      canvasRef?.current?.setAttribute(`willReadFrequently`, ``)

      // Store the panels for use in the onResizeMove callbacks
      canvasPanelRef.current = panels.canvasPanel
      lPPanelRef.current = panels.lPPanel
      
      // panelDimsFromCanvas({
      //   canvas: canvasRef.current,
      //   canvasPanel: canvasPanelRef.current,
      // })

    }, VNCConnectedEvt)

    return () => {
      off?.()
    }
  })

  return [
    parentElRef,
    onHorResizeMove,
    onVerResizeMove
  ] as [
    MutableRefObject<HTMLDivElement>,
    (event: ResizeMoveEvent) => void,
    (event: ResizeMoveEvent) => void
  ]

}