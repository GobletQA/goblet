import type { TToggleRaceModalEvt } from '@GBR/types'

import { Modals } from './Modals'
import { ERaceModal } from '@GBR/types'
import { exists } from '@keg-hub/jsutils'
import { useState, useMemo } from 'react'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { ModalManager, useOnEvent } from '@gobletqa/components'

export type TModal = {
  type?: ERaceModal
  visible?: boolean
  modalProps?: Record<any, any>
}

export const Modal = (props:TModal) => {

  const [open, setOpen] = useState<boolean>(props.visible || false)
  const [type, setType] = useState<ERaceModal>()
  
  const onToggle = (state?:boolean) => {
    exists<boolean>(state) ? setOpen(state) : setOpen(!open)
  }

  const ActiveModal = useMemo(
    () => type && Object.values(Modals).find(Modal => Modal.modalType === type),
    [type]
  )

  useOnEvent<TToggleRaceModalEvt>(ToggleRaceModalEvt, ({ state, type }) => {
    const toggle = exists(state) ? state : !open
    setOpen(toggle)

    const updated = exists(type) ? type : undefined
    setType(updated)
  })

  return ActiveModal && (
    <ModalManager
      {...props}
      open={open}
      Modal={ActiveModal}
      toggleModal={onToggle}
    />
  )

}