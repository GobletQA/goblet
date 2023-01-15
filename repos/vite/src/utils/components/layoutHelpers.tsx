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
  canvas: HTMLCanvasElement
  canvasPanel: HTMLDivElement
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
  canvasPanel,
  canvas,
}:TChildPanels) => {
  const lWidth = canvasPanel.offsetWidth
  const lHeight = toNum(canvasPanel.style.flexBasis || canvasPanel.offsetHeight)

  const cWidth = toNum(canvas?.offsetWidth) || lWidth
  const cHeight = toNum(canvas?.offsetHeight) || lHeight
  const wDiff = lWidth - cWidth

  return {
    lWidth,
    lHeight,
    cWidth,
    cHeight,
    wDiff
  }
}

export const setPanelFull = ({
  zPanel,
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

  const [_, canvasPanel, __] = getChildPanels(rPPanel)
  if(!canvasPanel) return console.warn(`Could not find Right Top Vertical Panel`)

  return { lPPanel, rPPanel, canvasPanel }
}

export const parentDimsFromCanvas = (args:TParentPanels) => {
  const { lPPanel } = args

  const { wDiff } = getPanelDims(args)

  if(wDiff) {
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
  const { canvasPanel } = args
  const { wDiff, lHeight } = getPanelDims(args)

  if(wDiff) {
    // Otherwise adjust the height relative to the width
    const adjust = wDiff / ScreencastRatio
    canvasPanel.style.flexBasis = `${lHeight + adjust}px`
  }

  EE.emit(PanelDimsSetEvt, { canvasPanel })
}
