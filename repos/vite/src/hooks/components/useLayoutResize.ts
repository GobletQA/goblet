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
} from '@utils/components/panelHelpers'
import {
  VNCResizeEvt,
  VNCConnectedEvt,
  PanelDimsSetEvt,
} from '@constants'


export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const lPPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  const onHorResizeMove = useInline(() => EE.emit(PanelDimsSetEvt, { tPanel: lVPanelRef.current }))

  const onVerResizeMove = useInline(() => {
    lPPanelRef.current && lVPanelRef.current && canvasRef.current
      ? parentDimsFromCanvas({
          canvas: canvasRef.current,
          tPanel: lVPanelRef.current,
          lPPanel: lPPanelRef.current,
        })
      : console.warn(
          `Layout-Resize - Horizontal Panel Refs not set`,
          canvasRef.current,
          lVPanelRef.current,
          lPPanelRef.current,
        )
  })

  // Listen to external resize events, like window?
  // Then resizes the panels
  useEffectOnce(() => {
    const off = EE.on<RFB>(
      VNCResizeEvt,
      () => EE.emit(PanelDimsSetEvt, { tPanel: lVPanelRef.current }),
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
      canvasRef.current = get<HTMLCanvasElement>(rfb, `_canvas`)
      const panels = getPanels(parentElRef.current)

      if(!canvasRef.current || !panels || !panels.lPanel) return

      panels.lPanel.style.overflow = `hidden`
      canvasRef?.current?.setAttribute(`willReadFrequently`, ``)

      // Store the panels for use in the onResizeMove callbacks
      lVPanelRef.current = panels.lPanel
      lPPanelRef.current = panels.lPPanel
      
      panelDimsFromCanvas({
        canvas: canvasRef.current,
        tPanel: lVPanelRef.current,
      })

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