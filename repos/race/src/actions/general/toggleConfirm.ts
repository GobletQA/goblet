import type { TToggleRaceModalEvt } from '@GBR/types'


import { ERaceModal } from '@GBR/types'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

export type TToggleConfirm = {
  state:boolean
  [key:string]:any
}

export const toggleConfirm = (props:TToggleConfirm) => {
  EE.emit<TToggleRaceModalEvt>(ToggleRaceModalEvt, {
    ...props,
    type: ERaceModal.Confirm,
  })
}