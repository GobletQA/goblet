import type { MutableRefObject } from 'react'
import type { ResizeMoveEvent } from 'react-page-split'

import { dims } from '@theme'
import { toNum } from '@keg-hub/jsutils'
import { ResizePanelClass, ScreencastRatio } from '@constants'

export type TChildPanels = {
  lPanel: HTMLDivElement
  rPanel: HTMLDivElement
}

export type TOnSizeChange = TChildPanels & {
  diff: number
  lRatio: number
  lHeight: number
  rHeight: number
}

export const getChildPanels = (parentEl:HTMLDivElement, className:string=ResizePanelClass) => {
  const cls = className.startsWith(`.`) ? className : `.${className}`
  const found = parentEl?.querySelector?.(cls)

  return ([
    ...(found?.childNodes || [])
  ] as HTMLDivElement[]).filter(el => el.tagName === `DIV`)
}

export const getSizes = ({
  lPanel,
  rPanel,
}: TChildPanels) => {

  const lWidth = toNum(lPanel.offsetWidth)
  const lHeight = toNum(lPanel.style.flexBasis || lPanel.offsetHeight)

  return {
    lWidth,
    lHeight,
    rHeight: toNum(rPanel.style.flexBasis || rPanel.offsetHeight),
    lRatio: lWidth > lHeight ? (lWidth / ScreencastRatio) : (lHeight / ScreencastRatio),
  }
}

export const onSmaller = ({
  diff,
  lPanel,
  rPanel,
  lRatio,
  lHeight,
  rHeight,
}:TOnSizeChange) => {
  // The left panel is getting smaller in width
  // So make the right top vertical panel taller in height
  const adjust = (lHeight + diff) / lRatio
  lPanel.style.flexBasis = `${lHeight + diff}px`
  rPanel.style.flexBasis = `${rHeight - adjust}px`
}

export const onLarger = ({
  diff,
  lRatio,
  lPanel,
  rPanel,
  lHeight,
  rHeight,
}:TOnSizeChange) => {
  // The left panel is getting greater in width
  // So make the right top vertical panel shorter in height
  const adjust = (lHeight + diff) / lRatio
  lPanel.style.flexBasis = `${lHeight - diff}px`
  rPanel.style.flexBasis = `${rHeight + adjust}px`
}

export const getPanels = (parentEl:HTMLDivElement|null) => {
  if(!parentEl) return

  const [lPPanel, rPPanel] = getChildPanels(parentEl)
  if(!rPPanel) return console.warn(`Could not find Right Horizontal Panel`)

  const [lPanel, rPanel] = getChildPanels(rPPanel)
  if(!rPanel) return console.warn(`Could not find Right Vertical Panel`)
  
  return { lPPanel, rPPanel, lPanel, rPanel }
}

export const setPanelStyles = ({
  lPanel,
  rPanel,
}:TChildPanels) => {
  lPanel.style.overflow = `hidden`
  rPanel.style.overflow = `hidden`

  // Get the current heights of the panels
  const lHeight = toNum(lPanel.style.flexBasis || lPanel.offsetHeight)
  const rHeight = toNum(rPanel.style.flexBasis || rPanel.offsetHeight)

  // Get the default height of the browser nav bar
  // Divide by 2 to split diff between both panels
  const splitHeight = dims.browser.nav.height / 2

  // Add half to top panel because it includes the browser and nav bar
  lPanel.style.flexBasis = `calc( ${lHeight}px + ${splitHeight}px )`

  // Subtract half from bottom panel to adjust for the addition above
  rPanel.style.flexBasis = `calc( ${rHeight}px - ${splitHeight}px )`
}
