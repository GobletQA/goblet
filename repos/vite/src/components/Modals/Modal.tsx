
import type { ReactNode, ComponentProps } from 'react'
import { forwardRef } from 'react'

import { ModalTypes } from '@constants'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { TransitionProps } from '@mui/material/transitions'
import DialogContentText from '@mui/material/DialogContentText'

type TTransition = TransitionProps & { children: React.ReactElement<any, any> }
const Transition = forwardRef((props: TTransition, ref: React.Ref<unknown>) => (
  <Slide
    direction="up"
    ref={ref}
    {...props}
  />
))

export type TModalAction = {
  type?: string
  label?: string
  text?: string
  buttonProps?: ComponentProps<typeof Button>
}

export type TModal = Omit<ComponentProps<typeof Dialog>, "open"> & {
  type?: string
  text?: ReactNode
  open?: boolean,
  visible?: boolean,
  actions?: TModalAction[]
  onClose?: (...args:any[]) => void
  titleProps?: ComponentProps<typeof DialogTitle>
  actionProps?: ComponentProps<typeof DialogActions>
  contentProps?: ComponentProps<typeof DialogContent>
}

export const Modal = (props:TModal) => {
  
  const {
    visible=false,
    open=visible,
    text,
    title,
    onClose,
    actions,
    children,
    titleProps,
    actionProps,
    type=`main`,
    contentProps,
    maxWidth='md',
    fullWidth=true,
    fullScreen=false,
    ...rest
  } = props

  return (
    <Dialog
      keepMounted
      TransitionComponent={Transition}
      aria-labelledby={titleProps?.id || "gb-modal-title"}
      aria-describedby={contentProps?.id || "gb-modal-description"}
      {...rest}
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
    >

      {title && (<DialogTitle id="gb-modal-title" {...titleProps} >{title}</DialogTitle>)}

      <DialogContent id="gb-modal-description" {...contentProps} >
        {children}
        {text && (<DialogContentText>{text}</DialogContentText>)}
      </DialogContent>

      {actions && (
        <DialogActions {...actionProps} >
          {actions.map((action) => {
            const { label, text=label, buttonProps } = action
            return (
              <Button {...buttonProps} >
                {text}
              </Button>
            )
          })}
        </DialogActions>
      )}
      
    </Dialog>
  )
}