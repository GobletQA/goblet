import type { ComponentProps } from 'react'
import type { TModalAction } from './modal.types'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

export type TModalFooter = {
  actions?: TModalAction[]
  actionProps?: ComponentProps<typeof DialogActions>
}

export const ModalFooter = (props:TModalFooter) => {
  const {
    actions,
    actionProps
  } = props

  return (
    <DialogActions {...actionProps} >
      {actions?.map((action) => {
        const { label, text=label, ...buttonProps } = action
        return (
          <Button key={text} {...buttonProps} >
            {text}
          </Button>
        )
      })}
    </DialogActions>
  )
}