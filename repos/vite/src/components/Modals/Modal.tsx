
import type { ReactNode, ComponentProps } from 'react'
import { forwardRef, useCallback } from 'react'

import { ModalTypes } from '@constants'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import { toggleModal } from '@actions/modals'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { TransitionProps } from '@mui/material/transitions'
import DialogContentText from '@mui/material/DialogContentText'

const modalCloseReasons = [`escapeKeyDown`, `backdropClick`]

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
  Title?: ReactNode
  Content?: ReactNode
  manualClose:boolean
  overrideContent?:boolean
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
    Title,
    title,
    onClose,
    actions,
    Content,
    children,
    titleProps,
    actionProps,
    type=`main`,
    manualClose,
    contentProps,
    maxWidth='md',
    fullWidth=true,
    overrideContent,
    fullScreen=false,
    ...rest
  } = props

  const onCloseModal = useCallback((...args:any[]) => {
    if(manualClose === false && modalCloseReasons.includes(args[1])) return

    onClose?.(...args)
    toggleModal(false)

  }, [manualClose, onClose])


  return (
    <Dialog
      keepMounted
      transitionDuration={500}
      TransitionComponent={Transition}
      aria-labelledby={titleProps?.id || "gb-modal-title"}
      aria-describedby={contentProps?.id || "gb-modal-description"}
      {...rest}
      open={open}
      onClose={onCloseModal}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
    >
      {overrideContent ? children : (
        <>
          {Title || (title && (<DialogTitle id="gb-modal-title" {...titleProps} >{title}</DialogTitle>))}

          {Content || (
            <DialogContent id="gb-modal-description" {...contentProps} >
              {children}
              {text && (<DialogContentText>{text}</DialogContentText>)}
            </DialogContent>
          )}

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
        </>
      )}
    </Dialog>
  )
}