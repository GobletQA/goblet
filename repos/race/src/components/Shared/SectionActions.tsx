import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'
import type { ComponentProps, CSSProperties, ReactNode, ComponentType } from 'react'

import { ESectionType } from '@GBR/types'
import { cls } from '@keg-hub/jsutils'
import { Tooltip } from '@gobletqa/components'
import {
  SectionAct,
  SectionActs,
} from './Shared.styled'

export type TSectionAction = {
  id?:string
  key?:string
  label?:string
  className?:string
  sx?:CSSProperties
  children?:ReactNode
  iconProps?:ComponentProps<any>
  onClick?:(...args:any[]) => void
  Icon?:ReactNode|ComponentType<any>
}

export type TSectionActions = {
  className?:string
  actions?:TSectionAction[]
}

export type TSection = {
  id?:string
  uuid?:string
  show?:boolean
  label?:string
  type:ESectionType
  className?:string
  sx?:CSSProperties
  children:ReactNode
  initialExpand?:boolean
  actions?:TSectionAction[]
  dropdownSx?:CSSProperties
  onAdd?:(...args:any[]) => void
  parent:TScenarioParentAst|TStepParentAst
}

export const SectionActions = (props:TSectionActions) => {
  const { className, actions }  = props
  
  return (
    <SectionActs className={cls(`gr-section-actions`, className)} >
      {actions?.map(action => {
        return (
          <Tooltip
            loc='bottom'
            describeChild
            enterDelay={500}
            fontSize={`10px`}
            title={action.label}
            key={action.key || action.id || action.label}
          >
            <SectionAct
              sx={action.sx}
              id={action.id}
              Icon={action.Icon}
              onClick={action?.onClick}
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
