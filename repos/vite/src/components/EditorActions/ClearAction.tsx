import type { TSnapshotEvt } from '@types'
import type { TMenuItem } from '@gobletqa/components'


import { ESnapTool } from '@types'
import { DeleteForeverIcon } from '@gobletqa/components'
import { SnapshotToolEvt } from '@constants/events'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const ClearAction:TMenuItem = {
  closeMenu:true,
  Icon: DeleteForeverIcon,
  id:`clear-draw-in-editor-action`,
  key:`clear-draw-in-editor-action`,
  text: `Clear All`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Clear all layers over the browser`,
  },
  onClick: async (event, editor, loc, content) => {
    console.log(`Emit snapshot clear event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.clear })
  }
}
