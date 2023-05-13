import type { TModalRef, TModalComponent } from '@gobletqa/components'

import { ERaceModal } from '@GBR/types'
import { colors, WarningIcon } from '@gobletqa/components'

export const ConfirmModal:TModalRef = (props:TModalComponent) => {
  return (<></>)
}

ConfirmModal.modalType = ERaceModal.Confirm
ConfirmModal.modalProps = {
  maxWidth: `xs`,
  className: `gb-race-modal-confirm`,
  headerSx: {
    margin: `0px`
  },
  titleProps: {
    Icon: (<WarningIcon sx={{ color: colors.yellow10}} />)
  },
  actionProps: {
    sx: {
      paddingTop: `10px`,
      paddingBottom: `20px`,
      justifyContent: `space-around`
    }
  },
  onClose: (...args:any[]) => {
    
  },
}