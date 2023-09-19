import type { TColorOpt } from './component.types'
import type { TModalComponent } from '@gobletqa/components'



export enum EModalTypes {
  Idle = `idle`,
  IDLE = `idle`,
  idle = `idle`,
  Artifacts = `artifacts`,
  ARTIFACTS = `artifacts`,
  artifacts = `artifacts`,
  ExamRun = `examRun`,
  EXAM_RUN = `examRun`,
  examRun = `examRun`,
  Confirm = `confirm`,
  CONFIRM = `confirm`,
  confirm = `confirm`,
  Connect = `connect`,
  CONNECT = `connect`,
  connect = `connect`,
  Settings = `settings`,
  SETTINGS = `settings`,
  settings = `settings`,
  SignIn = `signIn`,
  SIGN_IN = `signIn`,
  signIn = `signIn`,
  Environments = `environments`,
  environments = `environments`,
  ENVIRONMENTS = `environments`,
  Waiting = `waiting`,
  waiting = `waiting`,
  WAITING = `waiting`
} 


import type { ComponentProps, ComponentType, CSSProperties, ReactNode } from 'react'

export type TModalAction = {
  text?: string
  label?: string
  type?: TColorOpt
  color?: TColorOpt
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  children?: ReactNode
  EndIcon?: ComponentType<any>
  StartIcon?: ComponentType<any>
  iconProps?: ComponentProps<any>
  onClick?: (...args:any[]) => any
  sx?: Array<CSSProperties> | CSSProperties
  size?: 'small' | 'medium' | 'large' | string
  classes?: string[] | Record<string, string> | string
  variant?: 'contained' | 'outlined' | 'text' | string
}

export type TModalActions = TModalAction[]

export type TAlert = Partial<TModalComponent> & {
  title: string
  okText?:string
  cancelText?:string
  className?: string
  content?:ReactNode
  children?:ReactNode
  fullWidth?: boolean
  fullScreen?: boolean
  floatContent?:boolean
  actions?: TModalActions
  onOk?:(...args:any[]) => any
  actionProps?: Record<any, any>
  onCancel?:(...args:any[]) => any
  sx?: Array<CSSProperties> | CSSProperties
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
}