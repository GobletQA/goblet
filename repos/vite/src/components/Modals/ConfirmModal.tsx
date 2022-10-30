import type { TModalRef, TModalComponent } from '@types'

import { ModalTypes } from '@constants'
import { WarningIcon } from '@components/Icons'

export const ConfirmModal:TModalRef = (props:TModalComponent) => {
  const { children } = props

  return (
    <>
      {children}
    </>
  )
}

ConfirmModal.modalType = ModalTypes.confirm
ConfirmModal.modalProps = {
  maxWidth: `xs`,
  title: `Confirm`,
  titleProps: {
    Icon: (<WarningIcon />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}