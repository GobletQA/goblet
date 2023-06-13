import type { TMenuItem } from '@gobletqa/components'
import type { TSnapshotEvt } from '@types'


import { ESnapTool } from '@types'
import { SnapshotToolEvt } from '@constants/events'
import { CropSquareIcon } from '@gobletqa/components'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const SquareAction:TMenuItem = {
  closeMenu:true,
  Icon: CropSquareIcon,
  id:`square-browser-action`,
  key:`square-browser-action`,
  text: `Square`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Draw a square over the browser`,
  },
  onClick: async (event) => {
    console.log(`Emit snapshot square event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.square })
  },
}
