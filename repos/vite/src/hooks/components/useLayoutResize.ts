import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useCallback, useRef, useEffect } from 'react'
import {
  getSizes,
  onLarger,
  getPanels,
  onSmaller,
  setPanelStyles,
} from '@utils/components/panelHelpers'


export const useLayoutResize = () => {

  const resizeNumRef = useRef<number>(0)
  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  
  const onResizeMove = useCallback((event:ResizeMoveEvent) => {
    if(!resizeNumRef.current) return resizeNumRef.current = event.to

    const lPanel = lVPanelRef.current
    const rPanel = rVPanelRef.current

    if(!lPanel || !rPanel) return console.warn(`Vertical Panel Refs not set`, lPanel, rPanel)

    const {
      lRatio,
      lHeight,
      rHeight,
    } = getSizes({ lPanel, rPanel })

    resizeNumRef.current > event.to
      ? onSmaller({
          lPanel,
          rPanel,
          lRatio,
          lHeight,
          rHeight,
          // The left panel is getting smaller in width
          diff: resizeNumRef.current - event.to
        })
      : onLarger({
          lPanel,
          rPanel,
          lRatio,
          lHeight,
          rHeight,
          // The left panel is getting greater in width
          diff: event.to - resizeNumRef.current
        })

    resizeNumRef.current = event.to
  }, [])

  useEffect(() => {
    const panels = getPanels(parentElRef.current)
    if(!panels) return

    setPanelStyles(panels)

    // Store the panels for use in the onResizeMove callback
    lVPanelRef.current = panels.lPanel
    rVPanelRef.current = panels.rPanel
  }, [])

  return [parentElRef, onResizeMove] as [MutableRefObject<HTMLDivElement>, (event: ResizeMoveEvent) => void]

}