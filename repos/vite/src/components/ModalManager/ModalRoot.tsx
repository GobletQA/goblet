import type { TModalSlots, TModal, TModalTransition } from '@types'

import {
  useMemo,
  Fragment,
  forwardRef,
  useCallback,
} from 'react'

import Slide from '@mui/material/Slide'
import Dialog from '@mui/material/Dialog'
import { noOpObj, exists } from '@keg-hub/jsutils'
import { ModalFooter } from './ModalFooter'
import { ModalHeader } from './ModalHeader'
import { ModalContent } from './ModalContent'
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


const useModalSlots = (props:TModal) => {
  const {
    Title,
    Header,
    Footer,
    Content,
    Container,
    ContentText,
    slots=noOpObj as TModalSlots
  } = props

  return useMemo(() => {
    return {
      Title: exists(slots.Title) ? slots.Title : Title,
      Footer: exists(slots.Footer) ? slots.Footer : Footer,
      Header: exists(slots.Header) ? slots.Header : Header,
      Content: exists(slots.Content) ? slots.Content : Content,
      Container: exists(slots.Container) ? slots.Container : Container,
      ContentText: exists(slots.ContentText) ? slots.ContentText : ContentText,
    }
  }, [
    slots,
    Title,
    Header,
    Footer,
    Content,
    Container,
    ContentText,
  ])
  
}

export const ModalRoot = (props:TModal) => {
  
  const {
    visible=false,
    open=visible,
    text,
    slots,
    title,
    onClose,
    actions,
    children,
    titleProps,
    actionProps,
    type=`main`,
    manualClose,
    contentProps,
    maxWidth='md',
    fullWidth=true,
    modalContext,
    setModalContext,
    overrideContent,
    fullScreen=false,
    Title:_TNoOp,
    Header:_HNoOp,
    Footer:_FNoOp,
    Content:_CNoOp,
    Content:_CTNoOp,
    Container:_CNNoOp,
    ...rest
  } = props

  const onCloseModal = useCallback((...args:any[]) => {
    if(manualClose === false && modalCloseReasons.includes(args[1])) return

    onClose?.(...args)
    toggleModal(false)

  }, [manualClose, onClose])

  const modalSlots = useModalSlots(props)
  const {
    Header,
    Footer,
    Content,
    Container,
    ContentText,
  } = modalSlots

  const [ContComp, contProps] = Container
    ? [Container, props]
    : [Fragment, noOpObj]

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
        <ContComp {...contProps} >
          {
            exists(Header)
              ? Header
                ? (
                    <Header
                      {...props}
                      {...modalSlots}
                      slots={modalSlots}
                    />
                  )
                : null
              : (
                  <ModalHeader
                    {...props}
                    {...modalSlots}
                    slots={modalSlots}
                  />
                )
          }
          {
            exists(Content)
              ? Content
                ? (
                    <Content
                      {...props}
                      {...modalSlots}
                      slots={modalSlots}
                    />
                  )
                : null
              : (
                  <ModalContent
                    {...props}
                    {...modalSlots}
                    slots={modalSlots}
                  />
                )
          }
          {
            exists(Footer)
              ?  Footer
                ? (
                    <Footer
                      {...props}
                      {...modalSlots}
                      slots={modalSlots} 
                    />
                  )
                : null
              : (
                  <ModalFooter
                    actions={actions}
                    actionProps={actionProps}
                  />
                )
        }
        </ContComp>
      )}
    </Dialog>
  )
}