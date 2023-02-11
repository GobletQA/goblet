import type { ComponentProps, CSSProperties, ReactNode, ComponentType } from 'react'

import { cls, isObj, isFunc } from '@keg-hub/jsutils'
import { Tooltip } from '@gobletqa/components'
import {
  SectionActBtn,
  SectionActIcnBtn,
  SectionActs,
} from './Section.styled'

export type TSectionActionMeta = {
  id?:string
  key?:string
  label?:string
  asButton?:boolean
  className?:string
  sx?:CSSProperties
  disabled?:boolean
  children?:ReactNode
  iconProps?:ComponentProps<any>
  onClick?:(...args:any[]) => void
  Icon?:ReactNode|ComponentType<any>
}

export type TSectionAction = ReactNode | TSectionActionMeta

export type TSectionActions = {
  sx?:CSSProperties
  className?:string
  actions?:TSectionAction[]
}

export const SectionActions = (props:TSectionActions) => {
  const { sx, className, actions }  = props
  
  return (
    <SectionActs
      sx={sx}
      className={cls(`gr-section-actions`, className)}
    >
      {actions?.map(meta => {
       
        if(isObj(meta) && (`$$typeof` in meta) && (`type` in meta && isFunc((meta as any)?.type))){
          return meta
        }

        const action = meta as TSectionActionMeta
        const Comp = action?.asButton ? SectionActBtn : SectionActIcnBtn

        return (
          <Tooltip
            loc='bottom'
            describeChild
            enterDelay={500}
            title={action.label}
            key={action.key || action.id || action.label}
          >
            <Comp
              sx={action.sx}
              id={action.id}
              Icon={action.Icon}
              onClick={action?.onClick}
              disabled={action.disabled}
              children={action.children}
              iconProps={action.iconProps}
              key={action.key || action.id || action.label}
              className={cls(`gr-section-action`, action.className)}
            />
          </Tooltip>
        )
      })}
    </SectionActs>
  )
  
}
