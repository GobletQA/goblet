import type { CSSProperties, ReactNode, ComponentProps, ComponentType } from 'react'
import type Button from '@mui/material/Button'
import type Dialog from '@mui/material/Dialog'
import type DialogTitle from '@mui/material/DialogTitle'
import type DialogActions from '@mui/material/DialogActions'
import type DialogContent from '@mui/material/DialogContent'
import type { TransitionProps } from '@mui/material/transitions'
import type { ModalRoot } from '@GBC/components/ModalManager/ModalRoot'

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
  open?: boolean
  text?: ReactNode
  ModalMessage?: any
  slots?: TModalSlots
  manualClose?:boolean
  headerSx?:CSSProperties
  actions?: TModalAction[]
  titleProps?: TModalTitle
  overrideContent?:boolean
  disableTransition?: boolean
  onClose?: (...args:any[]) => void
  Title?: ComponentType<any> | false
  toggleModal:(open?:boolean) => void
  Footer?: ComponentType<any> | false
  Header?: ComponentType<any> | false
  Content?: ComponentType<any> | false
  Container?: ComponentType<any> | false
  ContentText?: ComponentType<any> | false
  actionProps?: ComponentProps<typeof DialogActions>
  contentProps?: ComponentProps<typeof DialogContent>
}

export type TModalFooter = {
  sx?:CSSProperties
  children?: ReactNode
  actionProps?: ComponentProps<typeof DialogActions>
  actions?: TModalAction[] | Record<string, TModalAction>
}
