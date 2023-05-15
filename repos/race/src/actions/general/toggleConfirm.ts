import type { ReactNode } from 'react'
import type { TToggleRaceModalEvt } from '@GBR/types'
import type { TModalAction } from '@gobletqa/components'

import { ERaceModal } from '@GBR/types'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

type TConfirmCB = ({ action, confirmed }:{action:`Yes`|`No`, confirmed: boolean}) => void

export type TToggleConfirm = {
  state:boolean
  text?:ReactNode
  title?:ReactNode
  actions?:TModalAction[]
  [key:string]:any
}

export type TOpenYesNo = Omit<TToggleConfirm, `state`|`actions`> & {
  cb?:TConfirmCB
  callback?:TConfirmCB
  no?:Partial<TModalAction>
  yes?:Partial<TModalAction>
}

export const toggleConfirm = (props:TToggleConfirm) => {
  EE.emit<TToggleRaceModalEvt>(ToggleRaceModalEvt, {
    ...props,
    type: ERaceModal.Confirm,
  })
}


export const openYesNo = ({
  yes,
  no,
  cb,
  callback=cb,
  ...props
}:TOpenYesNo) => {
  
  /**
   * TODO: get access to settings and check if `confirmDelete` is active
   * If not, then call the `onClick` method for the yes option
   * Otherwise use the below code to open the `toggleConfirm` modal
   */
  toggleConfirm({
    ...props,
    state: true,
    actions: [
      {
        text: `No`,
        color: `error`,
        variant:`contained`,
        ...no,
        onClick: () => {
          toggleConfirm({ state: false })
          no?.onClick?.()
          const resp = { action: `No` as const, confirmed: false }
          callback?.(resp)
        },
      },
      {
        text: `Yes`,
        color: `success`,
        keyboard: `enter`,
        variant:`contained`,
        ...yes,
        onClick: () => {
          toggleConfirm({ state: false })
          yes?.onClick?.()
          const resp = { action: `Yes` as const, confirmed: true }
          callback?.(resp)
        },
      },
    ],
  })
}