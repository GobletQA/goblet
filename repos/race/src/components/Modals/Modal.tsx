import type { TToggleRaceModalEvt } from '@GBR/types'

import { Modals } from './Modals'
import { ERaceModal } from '@GBR/types'
import { useState, useMemo } from 'react'
import { exists, emptyObj } from '@keg-hub/jsutils'
import { ToggleRaceModalEvt } from '@GBR/constants'
import { ModalManager, useOnEvent, useInline } from '@gobletqa/components'

export type TModal = {
  type?: ERaceModal
  visible?: boolean
  modalProps?: Record<any, any>
}

export const Modal = (props:TModal) => {

  const [open, setOpen] = useState<boolean>(props.visible || false)
  const [type, setType] = useState<ERaceModal>()
  const [modalProps, setModalProps] = useState<Record<string, any>>(emptyObj)

  const ActiveModal = useMemo(
    () => type && Object.values(Modals).find(Modal => Modal.modalType === type),
    [type]
  )

  const onToggle = useInline((state?:boolean) => {
    exists<boolean>(state) ? setOpen(state) : setOpen(!open)
  })

  useOnEvent<TToggleRaceModalEvt>(ToggleRaceModalEvt, ({ state, type, ...props }) => {
    const toggle = exists<boolean>(state) ? state : !open
    setOpen(toggle)

    const updated = exists(type) ? type : undefined
    setType(updated)
    setModalProps(props)
  })

  return ActiveModal && (
    <ModalManager
      {...props}
      {...modalProps}
      open={open}
      Modal={ActiveModal}
      toggleModal={onToggle}
    />
  )

}