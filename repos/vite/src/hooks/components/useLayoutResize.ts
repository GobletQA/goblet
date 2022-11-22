import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useCallback, useRef } from 'react'

import { get } from '@keg-hub/jsutils'
import { useEffectOnce } from '../useEffectOnce'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { VNCResizeEvt, VNCConnectedEvt } from '@constants'
import { getPanels, panelDimsFromCanvas } from '@utils/components/panelHelpers'


const resizePanels = (
  canvasRef:MutableRefObject<HTMLCanvasElement|null>,
  lVPanelRef:MutableRefObject<HTMLDivElement|null>,
  rVPanelRef:MutableRefObject<HTMLDivElement|null>
) => {

  const canvas = canvasRef.current
  const tPanel = lVPanelRef.current
  const bPanel = rVPanelRef.current

  if(!tPanel || !bPanel || !canvas)
    return console.warn(`Layout-Resize - Vertical Panel Refs not set`, tPanel, bPanel)

  panelDimsFromCanvas({
    tPanel,
    bPanel,
    canvas
  })
}

export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  const onResizeMove = useCallback(() => resizePanels(canvasRef, lVPanelRef, rVPanelRef), [])

  // Listen to external resize events, like window?
  // Then resizes the panels
  useEffectOnce(() => {
    EE.on<RFB>(VNCResizeEvt, () => resizePanels(canvasRef, lVPanelRef, rVPanelRef), `vnc-layout-resize`)

    return () => {
      EE.off<RFB>(VNCResizeEvt, `vnc-layout-resize`)
    }
  })

  // Initial setup of the panel and canvas refs
  // Without this the other hooks don't work 
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
        tPanel: lVPanelRef.current,
        bPanel: rVPanelRef.current,
      })

    }, VNCConnectedEvt)

    return () => {
      EE.off<RFB>(VNCConnectedEvt, VNCConnectedEvt)
    }

  })

  return [parentElRef, onResizeMove] as [MutableRefObject<HTMLDivElement>, (event: ResizeMoveEvent) => void]

}