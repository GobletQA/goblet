import type { TMenuItem } from '@gobletqa/components'
import type {
  ReactNode,
  MouseEvent,
  ComponentType,
  ComponentProps,
  CSSProperties,
} from 'react'

import { cls } from '@keg-hub/jsutils'
import { ESectionType, ESectionExt }  from '@GBR/types'
import { SectionActionsMenu } from './SectionActionsMenu'
import {
  SectionActs,
  SectionMenuContainer
} from './SectionActions.styled'

export type TSectionActionMeta = {
  id?:string
  key?:string
  label?:string
  asButton?:boolean
  className?:string
  sx?:CSSProperties
  disabled?:boolean
  closeMenu?:boolean
  children?:ReactNode
  dividerTop?:boolean
  dividerBottom?:boolean
  iconProps?:ComponentProps<any>
  onClick?:(...args:any[]) => void
  Icon?:ReactNode|ComponentType<any>
  onCloseMenu?:(event: MouseEvent<HTMLElement>) => any
}

export type TSectionAction = ReactNode | TSectionActionMeta

export type TSectionActions = {
  id:string
  sx?:CSSProperties
  className?:string
  actions?:TSectionAction[]
  type:ESectionType|ESectionExt
}

export const SectionActions = (props:TSectionActions) => {
  const {
    id,
    sx,
    type,
    actions,
    className,
  } = props

  return (
    <SectionActs
      sx={sx}
      className={cls(`gb-section-actions`, className)}
    >
      <SectionMenuContainer>
        <SectionActionsMenu
          id={id}
          type={type}
          items={actions as TMenuItem[]}
        />
      </SectionMenuContainer>
    </SectionActs>
  )
  
}
