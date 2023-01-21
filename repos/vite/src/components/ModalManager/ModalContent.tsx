import type { TModal } from '@types'

import { exists } from '@keg-hub/jsutils'
import { colors } from '@gobletqa/components'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

export const ModalContent = (props:TModal) => {
  const {
    text,
    children,
    ContentText,
    contentProps,
  } = props

  return (
    <DialogContent
      id="gb-modal-description"
      sx={{
        borderTop: `2px solid ${colors.green10}`,
        borderBottom: `2px solid ${colors.green10}`,
      }}
      {...contentProps}
    >
      {children}
      {
        exists(ContentText)
          ? ContentText ? (<ContentText {...props} />) : null
          : text && (<DialogContentText>{text}</DialogContentText>)
      }
    </DialogContent>
  )
}