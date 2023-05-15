import type { CSSProperties } from 'react'
import type { TModalFooter, TModalAction } from '@GBC/types'

import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { useOnKeyDown } from '@GBC/hooks/dom/useOnKeyDown'
import { useGetIcon } from '@GBC/hooks/components/useGetIcon'


const FooterAction = (props:TModalAction) => {
  const {
    label,
    loading,
    onClick,
    EndIcon,
    endIcon,
    keyboard,
    disabled,
    startIcon,
    StartIcon,
    iconProps,
    text=label,
    onKeyDown=onClick,
    ...buttonProps
  } = props
  
  const EIcon = useGetIcon(EndIcon, endIcon)
  const SIcon = useGetIcon(StartIcon, startIcon)

  useOnKeyDown<HTMLButtonElement>({
    keyboard,
    onKeyDown
  })

  return (
    <Button
      key={text}
      onClick={onClick}
      disabled={disabled || loading}
      className='modal-footer-action'
      endIcon={EIcon && (<EIcon {...iconProps} />)}
      startIcon={SIcon && (<SIcon {...iconProps} />)}
      {...buttonProps as any}
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