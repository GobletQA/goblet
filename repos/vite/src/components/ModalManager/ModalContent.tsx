import type { TModal } from '@types'

import { exists } from '@keg-hub/jsutils'
import { colors } from '@gobletqa/components'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

const styles = {
  content: {
    padding: `10px 10px`,
    borderTop: `2px solid ${colors.green10}`,
    borderBottom: `2px solid ${colors.green10}`,
  }
}

export const ModalContent = (props:TModal) => {
  const {
    text,
    children,
    ContentText,
    contentProps,
  } = props

  return (
    <DialogContent
      sx={styles.content}
      id="gb-modal-description"
      className='gb-modal-content'
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