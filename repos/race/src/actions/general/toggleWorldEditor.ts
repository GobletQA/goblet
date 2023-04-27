import type { TToggleRaceModalEvt } from '@GBR/types'


import { ERaceModal } from '@GBR/types'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export const toggleWorldEditor = (state?:boolean) => {
  EE.emit<TToggleRaceModalEvt>(ToggleRaceModalEvt, { state, type: ERaceModal.WorldEditor })
}