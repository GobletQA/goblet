import type { TModalRef, TModalComponent } from '@types'

import { ModalTypes } from '@constants'

export const ConfirmModal:TModalRef = (props:TModalComponent) => {
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