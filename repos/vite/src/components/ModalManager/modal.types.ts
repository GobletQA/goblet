import type { ReactNode, ComponentProps } from 'react'
import type Button from '@mui/material/Button'
import type Dialog from '@mui/material/Dialog'
import type DialogTitle from '@mui/material/DialogTitle'
import type DialogActions from '@mui/material/DialogActions'
import type DialogContent from '@mui/material/DialogContent'
import type { TransitionProps } from '@mui/material/transitions'

export type TModalTransition = TransitionProps & { children: React.ReactElement<any, any> }

export type TModalAction = ComponentProps<typeof Button> & {
  text?: string
  label?: string
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
  ModalMessage?: any
  Content?: ReactNode
  manualClose?:boolean
  overrideContent?:boolean
  actions?: TModalAction[]
  onClose?: (...args:any[]) => void
  titleProps?: TModalTitle
  actionProps?: ComponentProps<typeof DialogActions>
  contentProps?: ComponentProps<typeof DialogContent>
}

export type TModalFooter = {
  actions?: TModalAction[]
  actionProps: ComponentProps<typeof DialogActions>
}
