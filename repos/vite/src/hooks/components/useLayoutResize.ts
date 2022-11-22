import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useCallback, useRef } from 'react'

import { get } from '@keg-hub/jsutils'
import { VNCResizeEvt, VNCConnectedEvt, WindowResizeEvt } from '@constants'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  getPanels,
  panelDimsFromCanvas,
} from '@utils/components/panelHelpers'


export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  
  const onResizeMove = useCallback((event:ResizeMoveEvent) => {
    const canvas = canvasRef.current
    const lPanel = lVPanelRef.current
    const rPanel = rVPanelRef.current

    if(!lPanel || !rPanel || !canvas) return console.warn(`Drag-Resize - Vertical Panel Refs not set`, lPanel, rPanel)

    panelDimsFromCanvas({
      lPanel,
      rPanel,
      canvas
    })

  }, [])

  useEffectOnce(() => {
    EE.on<RFB>(VNCResizeEvt, (rfb) => {
      const canvas = canvasRef.current
      const lPanel = lVPanelRef.current
      const rPanel = rVPanelRef.current

      if(!lPanel || !rPanel || !canvas)
        return console.warn(`Window-Resize - Vertical Panel Refs not set`, lPanel, rPanel)

      panelDimsFromCanvas({
        lPanel,
        rPanel,
        canvas
      })

    }, `vnc-layout-resize`)

    return () => {
      EE.off<RFB>(VNCResizeEvt, `vnc-layout-resize`)
    }
  })

  useEffectOnce(() => {

    EE.on<RFB>(VNCConnectedEvt, (rfb) => {
      canvasRef.current = get<HTMLCanvasElement>(rfb, `_canvas`)
      const panels = getPanels(parentElRef.current)

      if(!canvasRef.current || !panels || !panels.lPanel || !panels.rPanel) return

      panels.lPanel.style.overflow = `hidden`
      panels.rPanel.style.overflow = `hidden`

      // Store the panels for use in the onResizeMove callback
      lVPanelRef.current = panels.lPanel
      rVPanelRef.current = panels.rPanel
      
      panelDimsFromCanvas({
        canvas: canvasRef.current,
        rPanel: rVPanelRef.current,
        lPanel: lVPanelRef.current,
      })

    }, VNCConnectedEvt)

    return () => {
      EE.off<RFB>(VNCConnectedEvt, VNCConnectedEvt)
    }

  })

  return [parentElRef, onResizeMove] as [MutableRefObject<HTMLDivElement>, (event: ResizeMoveEvent) => void]

}