import type { ComponentProps } from 'react'
import { Modal } from './Modal'

import { ModalTypes } from '@constants'

export type TConfirmModal = ComponentProps<typeof Modal> & {
  
}

export const ConfirmModal = (props:TConfirmModal) => {
  return (
    <div>
      ConfirmModal
    </div>
  )
}

ConfirmModal.modalType = ModalTypes.confirm