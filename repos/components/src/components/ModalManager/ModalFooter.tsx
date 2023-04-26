import type { CSSProperties } from 'react'
import type { TModalFooter, TModalAction } from '@GBC/types'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { useGetIcon } from '@GBC/hooks/components/useGetIcon'

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
  
  const EIcon = useGetIcon(EndIcon, endIcon)
  const SIcon = useGetIcon(StartIcon, startIcon)

  return (
    <Button
      key={text}
      className='modal-footer-action'
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
        <DialogActions
          className='modal-footer-actions'
          {...actionProps}
          {...rest}
          sx={[
            actionProps?.sx as CSSProperties,
            rest?.sx as CSSProperties
          ]}
        >
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