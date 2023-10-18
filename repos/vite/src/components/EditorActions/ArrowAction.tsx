import type { TMenuItem } from '@gobletqa/components'

import { ArrowForwardIcon } from '@gobletqa/components'
import type { TSnapshotEvt } from '@types'

import { ESnapTool } from '@types'
import { SnapshotToolEvt } from '@constants/events'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const ArrowAction:TMenuItem = {
  closeMenu:true,
  Icon: ArrowForwardIcon,
  id:`arrow-draw-in-editor-action`,
  key:`arrow-draw-in-editor-action`,
  text: `Arrow`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Draw an arrow over the browser`,
  },
  onClick: async (event, editor, loc, content) => {
    console.log(`Emit snapshot arrow event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.arrow })
  }
}
