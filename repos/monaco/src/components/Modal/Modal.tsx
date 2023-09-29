import type {
  ReactNode,
  CSSProperties,
  ComponentType,
  ComponentProps,
} from 'react'

import { Fragment } from 'react'
import { emptyObj, isArr } from '@keg-hub/jsutils'

type TColorOpt = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | string

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

export type TModalMethod = {
  title: string
  className?: string
  content?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  fullScreen?: boolean
  floatContent?: boolean
  actions?: TModalActions
  okText?: string
  onOk?: (...args:any[]) => any
  cancelText?: string
  onCancel?: (...args:any[]) => any,
  actionProps?: Record<any, any>
  sx?: Array<CSSProperties> | CSSProperties
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false | string
}


export type TModalOpts = {
  open: (...args:any[]) => any
  close: (...args:any[]) => any
  confirm?: (...args:any[]) => any
}

const wrapContent = (
  content?: ReactNode,
  children?: ReactNode,
) => {
  children = children || content
  return !isArr(children)
    ? children
    : <Fragment>{children ?? null}</Fragment>
}

/**
 * Loop the actions and wrap the onClick handler
 * Add call to close modal after onClick
 */
const wrapActions = (
  modal:Modal,
  actions:TModalActions,
  okText?:string,
  onOk?:(...args:any[]) => any,
  cancelText?:string,
  onCancel?:(...args:any[]) => any,
) => {
  const builtActs:TModalActions = [
    onCancel && ({
      color: `error`,
      variant: `contained`,
      startIcon: `CloseIcon`,
      text: cancelText || `CANCEL`,
      sx: { marginRight: `12px`, minWidth: `100px` },
      onClick: async (...args:any) => {
        const resp = await onCancel?.(...args)
        modal.close?.(resp, ...args)
      },
    } as TModalAction),
    onOk && ({
      color: `success`,
      keyboard: `enter`,
      variant: `contained`,
      text: okText || `OK`,
      startIcon: `CheckIcon`,
      sx: { color: `#FFFFFF`, minWidth: `100px` },
      onClick: async (...args:any) => {
        const resp = await onOk?.(...args)
        modal.close?.(resp, ...args)
      },
    } as TModalAction)
  ].filter(Boolean) as TModalActions

  return (actions.map((act) => {
    const {
      text,
      type,
      color,
      onClick,
      children,
      ...rest
    } = act
    return {
      ...rest,
      color: color || type,
      text: children || text,
      onClick: (...args:any) => {
        const resp = onClick?.(...args)
        modal.close?.(resp, ...args)
      }
    }
  }) as TModalActions).concat(builtActs)
}

const buildModalParams = (modal:Modal, params:TModalMethod, noWrap:boolean) => {
  if(noWrap) return params

    const {
      onOk,
      actions,
      onCancel,
      content,
      children,
      okText,
      cancelText,
      floatContent,
      ...rest
    } = params

  return {
    ...rest,
    ...(floatContent ? { overrideContent: true } : emptyObj),
    children: wrapContent(content, children),
    actions: wrapActions(
      modal,
      actions || [],
      okText,
      onOk,
      cancelText,
      onCancel
    )
  }
}

export class Modal {
  
  close: (...args:any[]) => any
  #openModal: (...args:any[]) => any
  #confirmModal: (...args:any[]) => any

  constructor(modalConf:TModalOpts){
    const {
      open,
      close,
      confirm=open
    } = modalConf

    this.close = close
    this.#openModal = open
    this.#confirmModal = confirm
  }

  confirm = (params:TModalMethod, noWrap:boolean=false) => {
    this.#confirmModal(buildModalParams(this, params, noWrap))
  }

  create = (params:TModalMethod, noWrap:boolean=false) => this.open(params, noWrap)
  open = (params:TModalMethod, noWrap:boolean=false) => {
    this.#openModal(buildModalParams(this, params, noWrap))
  }

}

