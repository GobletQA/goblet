
import type { ReactNode, ComponentProps, CSSProperties } from 'react'
import { forwardRef, useCallback } from 'react'
import { noOpObj } from '@keg-hub/jsutils'

import Box from '@mui/material/Box'
import { gutter } from '@theme/gutter'
import Slide from '@mui/material/Slide'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { toggleModal } from '@actions/modals'
import Typography from '@mui/material/Typography'
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

export type TModalTitle = ComponentProps<typeof DialogTitle> & {
  Icon?: ReactNode
}

export type TModal = Omit<ComponentProps<typeof Dialog>, "open"> & {
  type?: string
  text?: ReactNode
  open?: boolean,
  visible?: boolean,
  Title?: ReactNode
  Content?: ReactNode
  manualClose?:boolean
  overrideContent?:boolean
  actions?: TModalAction[]
  onClose?: (...args:any[]) => void
  titleProps?: TModalTitle
  actionProps?: ComponentProps<typeof DialogActions>
  contentProps?: ComponentProps<typeof DialogContent>
}

export const ModalHeader = (props:TModal) => {
  const {
    title,
    titleProps=noOpObj as TModalTitle,
  } = props

  const { Icon, ...rest } = titleProps

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignContent="center"
      alignItems="center"
      justifyContent="center"
      color="common.white"
      bgcolor="colors.navyBlue"
      padding={`${gutter.padding.tQpx} ${gutter.padding.px}`}
    >
      {Icon}
      <Typography
        id="gb-modal-title"
        variant="h2"
        {...rest}
        sx={[{
          padding: 'none',
          textAlign: `center`,
          marginLeft: gutter.margin.hpx,
        }, titleProps?.sx as CSSProperties]}
      >
        {title}
      </Typography>
      <Divider />
    </Box>
  )
}

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
            <DialogContent id="gb-modal-description" dividers {...contentProps} >
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