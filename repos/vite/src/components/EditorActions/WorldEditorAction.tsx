import type { TMenuItem } from '@gobletqa/components'
import type { TToggleRaceModalEvt } from '@gobletqa/race'

import { WorldIcon } from '@gobletqa/components'
import { EE } from '@services/sharedService'
import { ToggleRaceModalEvt, ERaceModal } from '@gobletqa/race'


export const WorldEditorAction:TMenuItem = {
  closeMenu:true,
  Icon: WorldIcon,
  text: `Open World Editor`,
  id:`open-world-editor-action`,
  key:`open-world-editor-action`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Opens a modal that allows editing the mounted repos world.json file`,
  },
  onClick: async () => {
    // EE.emit<TToggleRaceModalEvt>(ToggleRaceModalEvt, { state:true, type: ERaceModal.WorldEditor })
  },
}
