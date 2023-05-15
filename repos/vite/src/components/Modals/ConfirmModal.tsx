import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { EModalTypes } from '@types'
import { colors, WarningIcon } from '@gobletqa/components'

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
  headerSx: {
    margin: `0px`
  },
  titleProps: {
    Icon: (<WarningIcon sx={{ color: colors.yellow10}} />)
  },
  actionProps: {
    sx: {
      paddingTop: `0px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
}