import { dims } from '@theme'
import { toNum } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { ScreencastRatio } from '@constants/screencast'
import { PanelDimsSetEvt, ResizePanelClass } from '@constants'

export type TSetPanelFull = {
  expanded:boolean
  fPanel:HTMLDivElement
  zPanel:HTMLDivElement
  lPPanel:HTMLDivElement
  canvas:HTMLCanvasElement
}

export type TChildPanels = {
  fromExpand?: boolean
  tPanel: HTMLDivElement
  bPanel: HTMLDivElement
  canvas: HTMLCanvasElement
}

export type TParentPanels = TChildPanels & {
  lPPanel: HTMLDivElement
}

export type TOnSizeChange = TChildPanels & {
  diff: number
  lRatio: number
  lHeight: number
  rHeight: number
}

const getChildPanels = (parentEl:HTMLDivElement, className:string=ResizePanelClass) => {
  const cls = className.startsWith(`.`) ? className : `.${className}`
  const found = parentEl?.querySelector?.(cls)

  return ([
    ...(found?.childNodes || [])
  ] as HTMLDivElement[]).filter(el => el.tagName === `DIV`)
}

const getPanelDims = ({
  tPanel,
  bPanel,
  canvas,
}:TChildPanels) => {
  const lWidth = tPanel.offsetWidth
  const lHeight = toNum(tPanel.style.flexBasis || tPanel.offsetHeight)
  const rHeight = toNum(bPanel.style.flexBasis || bPanel.offsetHeight)

  const cWidth = toNum(canvas?.offsetWidth) || lWidth
  const cHeight = toNum(canvas?.offsetHeight) || lHeight
  const wDiff = lWidth - cWidth

  return {
    lWidth,
    lHeight,
    rHeight,
    cWidth,
    cHeight,
    wDiff
  }
}

export const setPanelFull = ({
  fPanel,
  zPanel,
  lPPanel,
  expanded,
}:TSetPanelFull) => {
  expanded
    ? (zPanel.style.maxHeight = `0px`)
    : (zPanel.style.maxHeight = `unset`)
}

export const getPanels = (parentEl:HTMLDivElement|null) => {
  if(!parentEl) return

  const [lPPanel, rPPanel] = getChildPanels(parentEl)
  if(!rPPanel) return console.warn(`Could not find Right Horizontal Panel`)

  const [lPanel, rPanel] = getChildPanels(rPPanel)
  if(!rPanel) return console.warn(`Could not find Right Vertical Panel`)
  
  return { lPPanel, rPPanel, lPanel, rPanel }
}

export const parentDimsFromCanvas = (args:TParentPanels) => {
  const { lPPanel, bPanel } = args

  const {
    wDiff,
    rHeight,
    cHeight,
  } = getPanelDims(args)

  if(!wDiff){

    const panelParent = bPanel.parentNode as HTMLDivElement
    const parentH = panelParent.offsetHeight

    // Get amount of px changed by subtracting the bottom panel From the parent panel
    // Get the current top panel height by adding the canvas height an browser nav height
    // Get the difference by subtracting the calculated top panel from the 
    const hDiff = (parentH - rHeight) - (cHeight + dims.browser.nav.height)
    // Find the relative width difference based on height difference and the screen ratio
    const adjust = ScreencastRatio * hDiff

    // Subtract the calculated width from the left side parent panel
    // This will automatically adjust the right panel content
    const lPWidth = toNum(lPPanel.style.flexBasis || lPPanel.offsetWidth)
    lPPanel.style.flexBasis = `${lPWidth - adjust}px`
  }
  else {
    // Multiply the difference by the screen ration
    const adjust = wDiff * ScreencastRatio
    // Add the calculated width to the left side panel
    // This will automatically adjust the right panel content
    const lPWidth = toNum(lPPanel.style.flexBasis || lPPanel.offsetWidth)
    lPPanel.style.flexBasis = `${lPWidth + adjust}px`
  }

  EE.emit(PanelDimsSetEvt, {})

}

export const panelDimsFromCanvas = (args:TChildPanels) => {
  const { tPanel, bPanel, fromExpand } = args

  const {
    wDiff,
    cHeight,
    lHeight,
    rHeight,
  } = getPanelDims(args)

  if(fromExpand){
    const parentW = (bPanel.parentNode as HTMLDivElement).offsetWidth
    const parentH = (bPanel.parentNode as HTMLDivElement).offsetHeight
    const tPHeight = (parentW / ScreencastRatio) + dims.browser.nav.height
    tPanel.style.flexBasis = `${tPHeight}px`

    const bPHeight = parentH - tPHeight - dims.panel.divider.height
    bPanel.style.flexBasis = `${bPHeight}px`
  }

  // If there's no width difference, then adjust the height
  else if(!wDiff){

    const parentH = (bPanel.parentNode as HTMLDivElement).offsetHeight

    // Left panel height is the canvas height + the browser nav height
    const tPHeight = cHeight + dims.browser.nav.height + dims.panel.divider.height
    tPanel.style.flexBasis = `${tPHeight}px`

    // Right panel height is the parent height minus the height of the left panel
    // Minus the panel divider height
    const bPHeight = parentH - tPHeight - dims.panel.divider.height
    bPanel.style.flexBasis = `${bPHeight}px`
  }
  else {
    // Otherwise adjust the height relative to the width
    const adjust = wDiff / ScreencastRatio
    tPanel.style.flexBasis = `${lHeight + adjust}px`
    bPanel.style.flexBasis = `${rHeight - adjust}px`
  }

  EE.emit(PanelDimsSetEvt, { tPanel, bPanel })

}
