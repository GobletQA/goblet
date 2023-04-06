import type { TModal } from '@types'

import { exists } from '@keg-hub/jsutils'
import { colors, gutter } from '@gobletqa/components'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

const styles = {
  content: {
    padding: gutter.padding.px,
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