
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

export const getPanels = (parentEl:HTMLDivElement|null) => {
  if(!parentEl) return

  const [lPPanel, rPPanel] = getChildPanels(parentEl)
  if(!rPPanel) return console.warn(`Could not find Right Horizontal Panel`)

  const [lPanel, rPanel] = getChildPanels(rPPanel)
  if(!rPanel) return console.warn(`Could not find Right Vertical Panel`)
  
  return { lPPanel, rPPanel, lPanel, rPanel }
}

export const panelDimsFromCanvas = ({
  tPanel,
  bPanel,
  canvas,
}:TChildPanels) => {
  // Get the current heights of the panels and canvas
  const lWidth = tPanel.offsetWidth
  const lHeight = toNum(tPanel.style.flexBasis || tPanel.offsetHeight)
  const rHeight = toNum(bPanel.style.flexBasis || bPanel.offsetHeight)

  const cWidth = toNum(canvas?.offsetWidth) || lWidth
  const cHeight = toNum(canvas?.offsetHeight) || lHeight
  const wDiff = lWidth - cWidth
  
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
