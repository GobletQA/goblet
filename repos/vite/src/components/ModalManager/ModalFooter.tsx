import type { ComponentProps } from 'react'
import type { TModalAction } from '@types'

import Button from '@mui/material/Button'
import { useIcon } from '@hooks/components/useIcon'
import DialogActions from '@mui/material/DialogActions'

export type TModalFooter = ComponentProps<typeof DialogActions> & {
  actionProps?: ComponentProps<typeof DialogActions>
  actions?: TModalAction[] | Record<string, TModalAction>
}

const FooterAction = (props:TModalAction) => {
  const {
    label,
    loading,
    disabled,
    text=label,
    EndIcon,
    endIcon,
    startIcon,
    StartIcon,
    iconProps,
    ...buttonProps
  } = props
  
  const EIcon = useIcon(EndIcon, endIcon)
  const SIcon = useIcon(StartIcon, startIcon)

  return (
    <Button
      key={text}
      disabled={disabled || loading}
      endIcon={EIcon && (<EIcon {...iconProps} />)}
      startIcon={SIcon && (<SIcon {...iconProps} />)}
      {...buttonProps}
    >
      {text}
    </Button>
  )
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
          {Object.values(actions)?.map((action) => (
            <FooterAction
              key={action?.label || action?.text}
              {...action}
            />
          ))}
          {children}
        </DialogActions>
      )
    : null
}