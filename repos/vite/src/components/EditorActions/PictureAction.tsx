import type { TMenuItem } from '@gobletqa/components'

import { CameraAltIcon } from '@gobletqa/components'

import type { TSnapshotEvt } from '@types'

import { ESnapTool } from '@types'
import { SnapshotToolEvt } from '@constants/events'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const PictureAction:TMenuItem = {
  closeMenu:true,
  Icon: CameraAltIcon,
  dividerTop: true,
  id:`picture-browser-action`,
  key:`picture-browser-action`,
  text: `Screenshot`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Capture a screenshot of the browsers current state`,
  },
  onClick: async (event) => {
    console.log(`Emit snapshot picture event`)
    EE.emit<TSnapshotEvt>(SnapshotToolEvt, { type: ESnapTool.picture })
  },
}
