import type { TSnapshotEvt } from '@types'
import type { TMenuItem } from '@gobletqa/components'


import { ESnapTool } from '@types'
import { SnapshotToolEvt } from '@constants/events'
import { TextFieldsIcon } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const TextAction:TMenuItem = {
  closeMenu:true,
  Icon: TextFieldsIcon,
  id:`text-draw-in-editor-action`,
  key:`text-draw-in-editor-action`,
  text: `Text`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Write text over the browser`,
  },
  onClick: async (event, editor, loc, content) => {
    console.log(`Emit snapshot text event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.text })
  }
}
