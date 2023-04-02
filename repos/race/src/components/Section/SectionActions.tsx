import type { ComponentProps, CSSProperties, ReactNode, ComponentType } from 'react'

import { SectionActs } from './Section.styled'
import { Tooltip } from '@gobletqa/components'
import { cls, isObj, isFunc } from '@keg-hub/jsutils'
import { ActionBtn, ActionIconBtn }  from '@GBR/components/Actions'

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
      className={cls(`gb-section-actions`, className)}
    >
      {actions?.map(meta => {
       
        if(isObj(meta) && (`$$typeof` in meta) && (`type` in meta && isFunc((meta as any)?.type))){
          return meta
        }

        const action = meta as TSectionActionMeta
        const Comp = action?.asButton ? ActionBtn : ActionIconBtn

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
              className={cls(`gb-section-action`, action.className)}
            />
          </Tooltip>
        )
      })}
    </SectionActs>
  )
  
}
