import type { TModalRef } from '@GBC/types'

import { ModalRoot } from './ModalRoot'
import { ModalMessage } from './ModalMessage'

export type TModalManager = {
  open?:boolean
  type?:string
  Modal:TModalRef
  toggleModal:(open?:boolean) => void
  [key:string]: any
}

export const ModalManager = (props:TModalManager) => {
  const {
    open,
    type,
    Modal,
    ...modalProps
  } = props

  return Modal && (
    <ModalRoot
      {...Modal?.modalProps}
      type={type ||  Modal.modalType}
      open={open}
      {...modalProps}
    >
      <Modal
        ModalMessage={ModalMessage}
        type={type ||  Modal.modalType}
        open={open}
        {...modalProps}
      />
    </ModalRoot>
  ) || null
}