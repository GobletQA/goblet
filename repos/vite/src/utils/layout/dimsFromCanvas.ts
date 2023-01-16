import type { TPanelDims } from './getPanelDims'

import { dims } from '@gobletqa/components'
import { PanelDimsSetEvt } from '@constants'
import { getPanelDims } from './getPanelDims'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { ScreencastRatio } from '@constants/screencast'



export type TParentPanels = TPanelDims & {
  rPPanel: HTMLDivElement
  lPPanel: HTMLDivElement
}

export const dimsFromCanvas = (args:TParentPanels) => {
  const { lPPanel, rPPanel } = args

  const panelDims = getPanelDims(args)
  const { hDiff, wDiff } = panelDims

  if(hDiff > wDiff){
    const adjust = hDiff * ScreencastRatio

    const lWidth = lPPanel.offsetWidth - adjust + 6
    lPPanel.style.flexBasis = `${lWidth}px`

    // @ts-ignore
    const rWidth = rPPanel.parentNode.offsetWidth - lWidth
    rPPanel.style.flexBasis = `${rWidth}px`
  }

  else if(wDiff) {
    const lWidth = lPPanel.offsetWidth + wDiff - 6
    lPPanel.style.flexBasis = `${lWidth}px`

    // @ts-ignore
    const rWidth = rPPanel.parentNode.offsetWidth - lWidth
    rPPanel.style.flexBasis = `${rWidth}px`
  }


  EE.emit(PanelDimsSetEvt, {})
}
