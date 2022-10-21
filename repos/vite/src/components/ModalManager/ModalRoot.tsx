import type { TModal, TModalTransition } from './modal.types'

import { forwardRef, useCallback } from 'react'
import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { toggleModal } from '@actions/modals'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'

const modalCloseReasons = [`escapeKeyDown`, `backdropClick`]

const Transition = forwardRef((props: TModalTransition, ref: React.Ref<unknown>) => (
  <Slide
    direction="up"
    ref={ref}
    {...props}
  />
))

export const ModalRoot = (props:TModal) => {
  
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
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      onClose={onCloseModal}
      fullScreen={fullScreen}
    >
      {overrideContent ? children : (
        <>
          {Title || (title && (<ModalHeader {...props} />))}

          {Content || (
            <DialogContent
              id="gb-modal-description"
              sx={{
                borderTop: "2px solid #00b8d4"
              }}
              dividers {...contentProps}
            >
              {children}
              {text && (<DialogContentText>{text}</DialogContentText>)}
            </DialogContent>
          )}

          {actions && (
            <ModalFooter
              actions={actions}
              actionProps={actionProps}
            />
          )}
        </>
      )}
    </Dialog>
  )
}