
import { dims } from '@theme'
import { toNum } from '@keg-hub/jsutils'
import { ResizePanelClass, ScreencastRatio } from '@constants'

export type TChildPanels = {
  lPanel: HTMLDivElement
  rPanel: HTMLDivElement
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
  lPanel,
  rPanel,
  canvas,
}:TChildPanels) => {
  // Get the current heights of the panels and canvas
  const lWidth = lPanel.offsetWidth
  const lHeight = toNum(lPanel.style.flexBasis || lPanel.offsetHeight)
  const rHeight = toNum(rPanel.style.flexBasis || rPanel.offsetHeight)

  const cWidth = toNum(canvas?.offsetWidth) || lWidth
  const cHeight = toNum(canvas?.offsetHeight) || lHeight
  const wDiff = lWidth - cWidth
  
  // If there's no width difference, then adjust the height
  if(!wDiff){
    const panelParent = rPanel.parentNode as HTMLDivElement
    const parentH = panelParent.offsetHeight

    // Left panel height is the canvas height + the browser nav height
    const lPHeight = cHeight + dims.browser.nav.height
    lPanel.style.flexBasis = `${lPHeight}px`

    // Right panel height is the parent height minus the height of the left panel
    // Minus the panel divider height
    const rPHeight = parentH - lPHeight - dims.panel.divider.height
    rPanel.style.flexBasis = `${rPHeight}px`
  }
  // Otherwise adjust the height relative to the width
  else {
    const adjust = wDiff / ScreencastRatio
    lPanel.style.flexBasis = `${lHeight + adjust}px`
    rPanel.style.flexBasis = `${rHeight - adjust}px`
  }
}
