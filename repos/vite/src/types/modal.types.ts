import type { ReactNode, ComponentProps, ComponentType } from 'react'
import type Button from '@mui/material/Button'
import type Dialog from '@mui/material/Dialog'
import type DialogTitle from '@mui/material/DialogTitle'
import type DialogActions from '@mui/material/DialogActions'
import type DialogContent from '@mui/material/DialogContent'
import type { TransitionProps } from '@mui/material/transitions'
import type { ModalRoot } from '@components/ModalManager/ModalRoot'

export type TModalRef = typeof ModalRoot & {
  modalType: string
  modalProps: Partial<TModalComponent>
}

export type TModalComponent = ComponentProps<typeof ModalRoot> & {
  className?: string
}

export type TModalTransition = TransitionProps & { children: React.ReactElement<any, any> }
    
export type TModalAction = Omit<ComponentProps<typeof Button>, `onClick` | `color` | `variant`> & {
  text?: string
  label?: string
  loading?: boolean
  EndIcon?: ComponentType<any>
  StartIcon?: ComponentType<any>
  iconProps?: ComponentProps<any>
  onClick?: (...args:any[]) => void
}

export type TModalTitle = ComponentProps<typeof DialogTitle> & {
  Icon?: ReactNode
}

export type TModalSlots = {
  Container?: ComponentType<any> | false
  Title?: ComponentType<any> | false
  Header?: ComponentType<any> | false
  Content?: ComponentType<any> | false
  ContentText?: ComponentType<any> | false
  Footer?: ComponentType<any> | false
}

export type TModal = Omit<ComponentProps<typeof Dialog>, "open"> & {
  type?: string
  text?: ReactNode
  open?: boolean
  visible?: boolean
  disableTransition?: boolean
  Container?: ComponentType<any> | false
  Title?: ComponentType<any> | false
  Header?: ComponentType<any> | false
  Content?: ComponentType<any> | false
  ContentText?: ComponentType<any> | false
  Footer?: ComponentType<any> | false
  slots?: TModalSlots
  ModalMessage?: any
  manualClose?:boolean
  overrideContent?:boolean
  actions?: TModalAction[]
  titleProps?: TModalTitle
  onClose?: (...args:any[]) => void
  actionProps?: ComponentProps<typeof DialogActions>
  contentProps?: ComponentProps<typeof DialogContent>
}

export type TModalFooter = {
  actions?: TModalAction[]
  actionProps: ComponentProps<typeof DialogActions>
}
