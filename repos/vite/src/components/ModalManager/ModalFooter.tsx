import type { ComponentProps } from 'react'
import type { TModalAction } from '@types'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

export type TModalFooter = ComponentProps<typeof DialogActions> & {
  actionProps?: ComponentProps<typeof DialogActions>
  actions?: TModalAction[] | Record<string, TModalAction>
}

export const ModalFooter = (props:TModalFooter) => {
  const {
    actions,
    children,
    actionProps,
    ...rest
  } = props

  return actions
    ? (
        <DialogActions {...rest} {...actionProps} >
          {Object.values(actions)?.map((action) => {
            const {
              label,
              text=label,
              EndIcon,
              StartIcon,
              iconProps,
              ...buttonProps
            } = action

            return (
              <Button
                endIcon={EndIcon && (<EndIcon {...iconProps} />)}
                startIcon={StartIcon && (<StartIcon {...iconProps} />)}
                key={text}
                {...buttonProps}
              >
                {text}
              </Button>
            )
          })}
          {children}
        </DialogActions>
      )
    : null
}