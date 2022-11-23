
import { dims } from '@theme'
import { toNum } from '@keg-hub/jsutils'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import {
  PanelDimsSetEvt,
  ScreencastRatio,
  ResizePanelClass,
} from '@constants'


export type TChildPanels = {
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

export const getPanels = (parentEl:HTMLDivElement|null) => {
  if(!parentEl) return

  const [lPPanel, rPPanel] = getChildPanels(parentEl)
  if(!rPPanel) return console.warn(`Could not find Right Horizontal Panel`)

  const [lPanel, rPanel] = getChildPanels(rPPanel)
  if(!rPanel) return console.warn(`Could not find Right Vertical Panel`)
  
  return { lPPanel, rPPanel, lPanel, rPanel }
}

export const parentDimsFromCanvas = (args:TParentPanels) => {
  const { lPPanel } = args

  const {
    wDiff,
    rHeight,
  } = getPanelDims(args)
  if(!wDiff) return

  // TODO: get the terminal div, and check it's height relative to the bottom panel heigh
  // Use the diff of that to calculate the Left parent panel width
  // When making the terminal smaller, the Left parent panel width should be greater
  // But not the full diff of the movement
  // Must be resized smaller relative to the terminal size diff and the Screencast ration

  // This only resizes when Terminal panel is made taller
  // Does not work when terminal panel is made shorter
  const lPWidth = toNum(lPPanel.style.flexBasis || lPPanel.offsetWidth)
  const adjust = wDiff * ScreencastRatio
  lPPanel.style.flexBasis = `${lPWidth + adjust}px`

}

export const panelDimsFromCanvas = (args:TChildPanels) => {
  const { tPanel, bPanel } = args

  const {
    wDiff,
    lHeight,
    rHeight,
    cHeight,
  } = getPanelDims(args)
  
  // If there's no width difference, then adjust the height
  if(!wDiff){
    const panelParent = bPanel.parentNode as HTMLDivElement
    const parentH = panelParent.offsetHeight

    // Left panel height is the canvas height + the browser nav height
    const lPHeight = cHeight + dims.browser.nav.height
    tPanel.style.flexBasis = `${lPHeight}px`

    // Right panel height is the parent height minus the height of the left panel
    // Minus the panel divider height
    const rPHeight = parentH - lPHeight - dims.panel.divider.height
    bPanel.style.flexBasis = `${rPHeight}px`
  }
  // Otherwise adjust the height relative to the width
  else {
    const adjust = wDiff / ScreencastRatio
    tPanel.style.flexBasis = `${lHeight + adjust}px`
    bPanel.style.flexBasis = `${rHeight - adjust}px`
  }

  EE.emit(PanelDimsSetEvt, { tPanel, bPanel })

}
