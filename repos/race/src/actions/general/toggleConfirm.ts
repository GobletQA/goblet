import type { ReactNode } from 'react'
import type { TToggleRaceModalEvt } from '@GBR/types'
import type { TModalAction } from '@gobletqa/components'

import { ERaceModal } from '@GBR/types'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { getSettings } from '@GBR/utils/editor/getSettings'

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


export const openYesNo = async ({
  yes,
  no,
  cb,
  callback=cb,
  ...props
}:TOpenYesNo) => {
  return new Promise(async (res) => {
    
    const onConfirm = (turnOffConfirm?:boolean) => {
      turnOffConfirm !== false && toggleConfirm({ state: false })

      const resp = { action: `Yes` as const, confirmed: true }
      if(callback) return res(callback?.(resp))

      const outcome = yes?.onClick?.(resp)
      res(outcome)
    }

    const { settings }  = await getSettings()
    
    /**
     * Skip opening the confirm modal is `confirmDelete` is **NOT** enabled
     * Othewise open the `toggleConfirm` modal
     */
    !settings.confirmDelete
      ? onConfirm(false)
      : toggleConfirm({
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
                const resp = { action: `No` as const, confirmed: false }
                no?.onClick?.(resp)
                callback?.(resp)
              },
            },
            {
              text: `Yes`,
              color: `success`,
              keyboard: `enter`,
              variant:`contained`,
              ...yes,
              onClick: () => onConfirm(),
            },
          ],
        })

  })
}