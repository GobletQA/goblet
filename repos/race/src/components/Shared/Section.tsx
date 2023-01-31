import type { CSSProperties, ReactNode } from 'react'
import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { capitalize, cls } from '@keg-hub/jsutils'
import {
  Dropdown,
  Container,
  SectionAct,
  SectionActs,
} from './Shared.styled'

export type TSectionAction = {
  id?:string
  key?:string
  label?:string
  Icon?:ReactNode
  className?:string
  sx?:CSSProperties
  children?:ReactNode
  onClick?:(...args:any[]) => void
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
  onAdd?:(...args:any[]) => void
  parent:TScenarioParentAst|TStepParentAst
}

export const SectionActions = (props:TSectionActions) => {
  const { className, actions }  = props
  
  return (
    <SectionActs className={cls(`gr-section-actions`, className)} >
      {actions?.map(action => {
        return (
          <SectionAct
            sx={action.sx}
            id={action.id}
            Icon={action.Icon}
            onClick={action?.onClick}
            children={action.children}
            key={action.key || action.id || action.label}
            className={cls(`gr-section-action`, action.className)}
          />
        )
      })}
    </SectionActs>
  )
  
}

export const Section = (props:TSection) => {

  const {
    id,
    sx,
    type,
    uuid,
    show,
    label,
    onAdd,
    parent,
    actions,
    children,
    className,
    initialExpand
  } = props


  return (
    <Container
      id={id || uuid}
      sx={sx}
      elevation={0}
      className={cls(`gr-section-dropdown-container`, className)}
    >
      { show
          ? (
              <Dropdown
                initialExpand={initialExpand}
                id={`${parent.uuid}-${id || uuid}`}
                headerText={capitalize(label || type)}
                actions={<SectionActions actions={actions} />}
                className={cls(`gr-section-dropdown`, `gr-section-dropdown-${type}`)}
              >
                {children}
              </Dropdown>
            )
          : onAdd && (
              <AddItem
                type={type}
                onClick={onAdd}
                parentId={parent.uuid}
                className={`gr-section-add-item gr-section-add-${type}`}
              />
            ) || null
      }
    </Container>
  )
}