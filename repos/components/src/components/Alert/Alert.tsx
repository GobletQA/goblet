import type { TOnAlertEvt, TAlertToggle, TOnAlertOpen, TAlertProps } from '@GBC/types'
import type {
  ReactNode,
  CSSProperties,
  ComponentProps,
} from 'react'

import { useOnEvent } from '@GBC/hooks'
import Dialog from '@mui/material/Dialog'
import { useState, useCallback } from 'react'
import { exists } from '@keg-hub/jsutils/exists'
import { Button } from '@GBC/components/Buttons'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import DialogContentText from '@mui/material/DialogContentText'
import {
  OnAlertOpen,
  OnAlertClose,
  OnAlertToggle,
  AlertWasOpened,
  AlertWasClosed,
} from '@GBC/constants'

export type TAlert = {
  text?:ReactNode
  title?:ReactNode
  sx?:CSSProperties
  cancelText?:ReactNode
  confirmText?:ReactNode
  onCancel?:(evt?:any) => void
  onConfirm?:(evt?:any) => void
  modalProps?:ComponentProps<typeof Dialog>
  cancelProps?:ComponentProps<typeof Button>
  confirmProps?:ComponentProps<typeof Button>
  titleProps?:ComponentProps<typeof DialogTitle>
  contentProps?:ComponentProps<typeof DialogContent>
  actionsProps?:ComponentProps<typeof DialogActions>
  textProps?:ComponentProps<typeof DialogContentText>
}

export type THAlert = {
  props?:TAlertProps
  onCancel?:() => void
  onConfirm?:() => void
  onOpen?:(state:TOnAlertEvt) => void
  onClose?:(state:TOnAlertEvt) => void
}

const styles = {
  dialog: {
    padding: `20px`,
  }
}


const closeAlert = () => EE.emit(OnAlertClose)
const alertOpen = (props?:TAlertProps) => EE.emit<TAlertProps>(OnAlertOpen, props)
const toggleAlert = (props:TAlertToggle) => EE.emit<TAlertToggle>(OnAlertToggle, props)

export const useAlert = (props:THAlert) => {

  const {
    onOpen,
    onClose,
    onCancel,
    onConfirm,
    props:alertProps
  } = props

  useOnEvent(AlertWasOpened, onOpen)
  useOnEvent<TOnAlertEvt>(AlertWasClosed, (data) => {
    const { confirmed } = data

    onClose?.(data)
    confirmed ? onConfirm?.() : onCancel?.()
  })

  const openAlert = useCallback(() => alertOpen(alertProps), [alertProps])

  return {
    openAlert,
    closeAlert,
    toggleAlert,
  }
}

export const Alert = (props:TAlert) => {
  const {
    text,
    title,
    onCancel,
    onConfirm,
    textProps,
    modalProps,
    titleProps,
    cancelProps,
    confirmProps,
    contentProps,
    actionsProps,
    confirmText=`Ok`,
    cancelText=`Cancel`,
  } = props

  const [open, setOpen] = useState<boolean>(false)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  const [alertProps, setAlertProps] = useState<TAlertProps>(emptyObj)

  useOnEvent<TOnAlertEvt>(AlertWasClosed, (data) => {
    const { confirmed } = data
    confirmed ? onConfirm?.() : onCancel?.()
  })

  const onConfirmed = useCallback(() => {
    onClose()
    setAlertProps(emptyObj)
    EE.emit<TOnAlertEvt>(AlertWasClosed, { open, setOpen, confirmed: true })
  }, [open, onClose])

  const onCanceled = useCallback(() => {
    onClose()
    setAlertProps(emptyObj)
    EE.emit<TOnAlertEvt>(AlertWasClosed, { open, setOpen, canceled: true })
  }, [open, onClose])

  useOnEvent<TAlertToggle>(OnAlertToggle, ({ open:toggle, props:alProps }) => {
    const updated = exists<boolean>(toggle) ? toggle : !open
    if(updated === open) return
    
    setOpen(updated)
    if(updated){
      alProps && setAlertProps(alProps)
      onOpen()
    }
    else onCanceled()
  })

  useOnEvent<TOnAlertOpen>(OnAlertOpen, (props) => {
    setAlertProps(props)
    onOpen()
  })

  useOnEvent(OnAlertClose, onCanceled)

  return (
    <Dialog
      open={open}
      {...modalProps}
      {...alertProps?.modalProps}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onClose={onCanceled}
      PaperProps={{
        ...modalProps?.PaperProps,
        ...alertProps?.modalProps?.PaperProps,
        sx: alertProps?.modalProps?.PaperProps?.sx
          || modalProps?.PaperProps?.sx as CSSProperties
          || styles.dialog
      }}
    >
      {(alertProps?.title || title) && (
        <DialogTitle
          id="alert-dialog-title"
          {...titleProps}
          {...alertProps?.titleProps}
        >
          {alertProps?.title || title}
        </DialogTitle>
      )|| null}

      {(alertProps?.text || text) && (
        <DialogContent
          {...contentProps}
          {...alertProps?.contentProps}
        >
          <DialogContentText
            id="alert-dialog-description"
            {...textProps}
            {...alertProps?.textProps}
          >
            {alertProps?.text || text}
          </DialogContentText>
        </DialogContent>
      ) || null}

      <DialogActions 
        {...actionsProps}
        {...alertProps?.actionsProps}
      >

        <Button
          color='error'
          text={alertProps?.cancelText || cancelText}
          variant='outlined'
          {...cancelProps}
          {...alertProps?.cancelProps}
          onClick={onCanceled}
        />

        <Button
          autoFocus
          color='success'
          text={alertProps?.confirmText || confirmText}
          variant='contained'
          {...confirmProps}
          {...alertProps?.confirmProps}
          onClick={onConfirmed}
        />

      </DialogActions>
    </Dialog>
)
}
