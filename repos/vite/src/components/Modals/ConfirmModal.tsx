import type { TModalRef, TModalComponent } from '@types'

import { ModalTypes } from '@constants'
import { WarningIcon } from '@components/Icons'

export const ConfirmModal:TModalRef = (props:TModalComponent) => {
  const {
    title,
    children,
  } = props

  return (
    <div>
      {children}
    </div>
  )
}

ConfirmModal.modalType = ModalTypes.confirm
ConfirmModal.modalProps = {
  title: `Confirm`,
  titleProps: {
    Icon: (<WarningIcon />)
  }
}