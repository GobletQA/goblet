import { dims } from '@gobletqa/components'

export type TPanelDims = {
  rPPanel: HTMLDivElement
  canvas: HTMLCanvasElement
}

export const getPanelDims = ({
  canvas,
  rPPanel,
}:TPanelDims) => {

  const rPWidth = rPPanel.offsetWidth
  const rPHeight = rPPanel.offsetHeight
  const cWidth = canvas.offsetWidth
  const cHeight = canvas.offsetHeight
  // Include the other components used with the browser canvas
  const extra = (dims.browser.actions.height + dims.browser.nav.height)

  return {
    cWidth,
    cHeight,
    rPWidth,
    rPHeight,
    wDiff: rPWidth - cWidth,
    hDiff: rPHeight - (cHeight + extra),
  }
}
