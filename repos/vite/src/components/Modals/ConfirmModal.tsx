import type { ComponentProps } from 'react'
import { ModalRoot } from '@components/ModalManager/ModalRoot'

import { ModalTypes } from '@constants'

export type TConfirmModal = ComponentProps<typeof ModalRoot>

export const ConfirmModal = (props:TConfirmModal) => {
  return (
    <div>
      ConfirmModal
    </div>
  )
}

ConfirmModal.modalType = ModalTypes.confirm
ConfirmModal.modalProps = {
  title: `Confirm`,
  titleProps: {}
}