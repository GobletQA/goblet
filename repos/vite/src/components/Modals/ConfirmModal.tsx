import type { TModalRef, TModalComponent } from '@types'

import { EModalTypes } from '@types'
import { WarningIcon } from '@gobletqa/components'

export const ConfirmModal:TModalRef = (props:TModalComponent) => {
  const { children } = props

  return (
    <>
      {children}
    </>
  )
}

ConfirmModal.modalType = EModalTypes.confirm
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