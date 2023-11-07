import type { ReactNode } from 'react'
import type { TModalProps } from './setActiveModal'
import type { TModalAction, TModalActions, TAlert } from '@types'

import { Fragment } from 'react'
import { confirmModal } from './modals'
import { toggleModal } from './toggleModal'
import {emptyObj, isArr} from '@keg-hub/jsutils'

const wrapContent = (
  content?: ReactNode,
  children?: ReactNode,
) => {
  children = children || content
  return (<Fragment>{children || null}</Fragment>)
}

const buildDefaultActs = (
  okText?:string,
  onOk?:(...args:any[]) => any,
  cancelText?:string,
  onCancel?:(...args:any[]) => any,
) => {
  const builtActs:TModalActions = []

  onCancel
    && builtActs.push({
      color: `error`,
      variant: `contained`,
      startIcon: `CloseIcon`,
      text: cancelText || `CANCEL`,
      sx: { marginRight: `12px`, minWidth: `100px` },
      onClick: async (...args:any) => {
        const resp = await onCancel?.(...args)
        toggleModal(false)

        return resp
      },
    } as TModalAction)
  
  onOk
    && builtActs.push({
      color: `success`,
      keyboard: `enter`,
      variant: `contained`,
      text: okText || `OK`,
      startIcon: `CheckIcon`,
      sx: { color: `#FFFFFF`, minWidth: `100px` },
      onClick: async (...args:any) => {
        const resp = await onOk?.(...args)
        toggleModal(false)

        return resp
      },
    } as TModalAction)

  return builtActs
}

/**
 * Loop the actions and wrap the onClick handler
 * Add call to close modal after onClick
 */
const wrapActions = (
  actions:TModalActions=[],
  okText?:string,
  onOk?:(...args:any[]) => any,
  cancelText?:string,
  onCancel?:(...args:any[]) => any,
) => {

  const customActs = actions?.length
    ? actions.map((act) => {
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
            toggleModal(false)

            return resp
          }
        } as TModalAction
      })
    : [] as TModalActions
  
  return customActs.concat(
    buildDefaultActs(
      okText,
      onOk,
      cancelText,
      onCancel,
    )
  )
}


const buildModalParams = (props:TAlert) => {
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
  } = props

  return {
    ...rest,
    ...(floatContent ? { overrideContent: true } : emptyObj),
    children: wrapContent(content, children),
    actions: wrapActions(
      actions,
      okText,
      onOk,
      cancelText,
      onCancel
    )
  }
}


export const Alert = (props:TAlert) => confirmModal(buildModalParams(props))