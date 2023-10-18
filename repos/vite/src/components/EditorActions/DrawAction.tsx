import type { TMenuItem } from '@gobletqa/components'

import { ModeEditIcon } from '@gobletqa/components'
import type { TSnapshotEvt } from '@types'

import { ESnapTool } from '@types'
import { SnapshotToolEvt } from '@constants/events'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const DrawAction:TMenuItem = {
  closeMenu:true,
  dividerTop: true,
  Icon: ModeEditIcon,
  id:`free-draw-in-editor-action`,
  key:`free-draw-in-editor-action`,
  text: `Pencil`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Free draw over the browser`,
  },
  onClick: async (event, editor, loc, content) => {
    console.log(`Emit snapshot draw event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.draw })
  }
}
