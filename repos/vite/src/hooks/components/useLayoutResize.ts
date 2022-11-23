import type RFB from '@novnc/novnc/core/rfb'
import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useCallback, useRef } from 'react'
import { get } from '@keg-hub/jsutils'
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
  TerminalExpandEvt
} from '@constants'


const resizeRightPanels = (
  canvasRef:MutableRefObject<HTMLCanvasElement|null>,
  lVPanelRef:MutableRefObject<HTMLDivElement|null>,
  rVPanelRef:MutableRefObject<HTMLDivElement|null>
) => {

  const canvas = canvasRef.current
  const tPanel = lVPanelRef.current
  const bPanel = rVPanelRef.current

  if(!tPanel || !bPanel || !canvas)
    return console.warn(`Layout-Resize - Vertical Panel Refs not set`, canvas, tPanel, bPanel)

  panelDimsFromCanvas({
    tPanel,
    bPanel,
    canvas
  })
}

const resizeLeftPanel = (
  lPPanelRef:MutableRefObject<HTMLDivElement|null>,
  canvasRef:MutableRefObject<HTMLCanvasElement|null>,
  lVPanelRef:MutableRefObject<HTMLDivElement|null>,
  rVPanelRef:MutableRefObject<HTMLDivElement|null>
) => {

  const canvas = canvasRef.current
  const tPanel = lVPanelRef.current
  const bPanel = rVPanelRef.current
  const lPPanel = lPPanelRef.current

  if(!lPPanel || !tPanel || !bPanel || !canvas)
    return console.warn(`Layout-Resize - Horizontal Panel Refs not set`, lPPanel, canvas, tPanel, bPanel)

  parentDimsFromCanvas({
    canvas,
    tPanel,
    bPanel,
    lPPanel
  })

}

export const useLayoutResize = () => {

  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  const lPPanelRef = useRef<HTMLDivElement|null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)

  const onHorResizeMove = useCallback(
    () => resizeRightPanels(canvasRef, lVPanelRef, rVPanelRef),
    []
  )

  const onVerResizeMove = useCallback(
    () => resizeLeftPanel(lPPanelRef, canvasRef, lVPanelRef, rVPanelRef),
    []
  )

  // Listen to external resize events, like window?
  // Then resizes the panels
  useEffectOnce(() => {
    EE.on<RFB>(VNCResizeEvt, () => resizeRightPanels(canvasRef, lVPanelRef, rVPanelRef), `vnc-layout-resize`)

    return () => {
      EE.off<RFB>(VNCResizeEvt, `vnc-layout-resize`)
    }
  })

  // Initial setup of the panel and canvas refs
  // Without this the other hooks don't work 
  useEffectOnce(() => {

    // When the VNC service connects, get the browser canvas
    // And use it to resize the panels relative to it
    EE.on<RFB>(VNCConnectedEvt, (rfb) => {
      canvasRef.current = get<HTMLCanvasElement>(rfb, `_canvas`)
      const panels = getPanels(parentElRef.current)

      if(!canvasRef.current || !panels || !panels.lPanel || !panels.rPanel) return

      panels.lPanel.style.overflow = `hidden`
      panels.rPanel.style.overflow = `hidden`

      // Store the panels for use in the onResizeMove callbacks
      lVPanelRef.current = panels.lPanel
      rVPanelRef.current = panels.rPanel
      lPPanelRef.current = panels.lPPanel
      
      panelDimsFromCanvas({
        canvas: canvasRef.current,
        tPanel: lVPanelRef.current,
        bPanel: rVPanelRef.current,
      })

    }, VNCConnectedEvt)


    // Listen for when the terminal should be expanded to full height
    EE.on(TerminalExpandEvt, (expanded) => {
      // TODO: update the right panels to expand the bottom terminal panel
      console.log(`------- expand bottom terminal panel -------`)

    }, TerminalExpandEvt)


    return () => {
      EE.off(TerminalExpandEvt, TerminalExpandEvt)
      EE.off<RFB>(VNCConnectedEvt, VNCConnectedEvt)
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