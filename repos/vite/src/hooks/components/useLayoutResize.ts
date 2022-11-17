import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { useCallback, useRef, useEffect } from 'react'

import { dims } from '@theme'
import { toNum } from '@keg-hub/jsutils'
import { ScreencastRatio } from '@constants'
import { getChildPanels } from '@utils/components/getChildPanels'


export type TOnSizeChange = {
  lRatio: number
  lHeight: number
  rHeight: number
  event: ResizeMoveEvent
  lVPanel: HTMLDivElement
  rVPanel: HTMLDivElement
  resizeNumRef: MutableRefObject<number>
}

type TGetSizes = {
  event: ResizeMoveEvent
  lVPanel: HTMLDivElement
  rVPanel: HTMLDivElement
  resizeNumRef: MutableRefObject<number>
}

const getSizes = ({
  event,
  lVPanel,
  rVPanel,
  resizeNumRef,
}: TGetSizes) => {

  const lWidth = toNum(lVPanel.offsetWidth)
  const lHeight = toNum(lVPanel.style.flexBasis || lVPanel.offsetHeight)

  return {
    lWidth,
    lHeight,
    rHeight: toNum(rVPanel.style.flexBasis || rVPanel.offsetHeight),
    lRatio: lWidth > lHeight ? (lWidth / ScreencastRatio) : (lHeight / ScreencastRatio),
  }
}

const onSmaller = ({
  event,
  lRatio,
  lHeight,
  rHeight,
  lVPanel,
  rVPanel,
  resizeNumRef
}:TOnSizeChange) => {
  // The left panel is getting smaller in width
  // So make the right top vertical panel taller in height
  const diff = resizeNumRef.current - event.to
  const adjust = (lHeight + diff) / lRatio
  lVPanel.style.flexBasis = `${lHeight + diff}px`
  rVPanel.style.flexBasis = `${rHeight - adjust}px`
}

const onLarger = ({
  event,
  lRatio,
  lHeight,
  rHeight,
  lVPanel,
  rVPanel,
  resizeNumRef
}:TOnSizeChange) => {
  // The left panel is getting greater in width
  // So make the right top vertical panel shorter in height
  const diff = event.to - resizeNumRef.current
  const adjust = (lHeight + diff) / lRatio
  lVPanel.style.flexBasis = `${lHeight - diff}px`
  rVPanel.style.flexBasis = `${rHeight + adjust}px`
}


export const useLayoutResize = () => {

  const resizeNumRef = useRef<number>(0)
  const parentElRef = useRef<HTMLDivElement|null>(null)
  const lVPanelRef = useRef<HTMLDivElement|null>(null)
  const rVPanelRef = useRef<HTMLDivElement|null>(null)
  
  const onResizeMove = useCallback((event:ResizeMoveEvent) => {
    if(!resizeNumRef.current) return resizeNumRef.current = event.to

    const lVPanel = lVPanelRef.current
    const rVPanel = rVPanelRef.current

    if(!lVPanel || !rVPanel) return console.warn(`Vertical Panel Refs not set`, lVPanel, rVPanel)

    const {
      lRatio,
      lHeight,
      rHeight,
    } = getSizes({
      event,
      lVPanel,
      rVPanel,
      resizeNumRef,
    })

    resizeNumRef.current > event.to
      ? onSmaller({
          event,
          lRatio,
          lHeight,
          rHeight,
          lVPanel,
          rVPanel,
          resizeNumRef
        })
      : onLarger({
          event,
          lRatio,
          lHeight,
          rHeight,
          lVPanel,
          rVPanel,
          resizeNumRef
        })

    resizeNumRef.current = event.to
  }, [])

  useEffect(() => {
    if(!parentElRef.current) return

    const [__, rHPanel] = getChildPanels(parentElRef.current)
    if(!rHPanel) return console.warn(`Could not find Right Horizontal Panel`)

    const [lVPanel, rVPanel] = getChildPanels(rHPanel)
    if(!rVPanel) return console.warn(`Could not find Right Vertical Panel`)

    lVPanel.style.overflow = `hidden`
    rVPanel.style.overflow = `hidden`
    
    const lHeight = toNum(lVPanel.style.flexBasis || lVPanel.offsetHeight)
    const rHeight = toNum(rVPanel.style.flexBasis || rVPanel.offsetHeight)

    const splitHeight = dims.browser.nav.height / 2
    lVPanel.style.flexBasis = `calc( ${lHeight}px + ${splitHeight}px )`
    rVPanel.style.flexBasis = `calc( ${rHeight}px - ${splitHeight}px )`

    lVPanelRef.current = lVPanel
    rVPanelRef.current = rVPanel
  }, [])

  return [parentElRef, onResizeMove] as [MutableRefObject<HTMLDivElement>, (event: ResizeMoveEvent) => void]

}