import type { CSSProperties, ReactNode } from 'react'
import type { TSectionAction } from './SectionActions'
import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { SectionActions } from './SectionActions'
import { capitalize, cls } from '@keg-hub/jsutils'
import { Dropdown, Container } from './Shared.styled'


export type TSection = {
  id?:string
  uuid?:string
  show?:boolean
  label?:string
  type:ESectionType
  className?:string
  sx?:CSSProperties
  noToggle?:boolean
  children:ReactNode
  initialExpand?:boolean
  actions?:TSectionAction[]
  dropdownSx?:CSSProperties
  onAdd?:(...args:any[]) => void
  parent:TScenarioParentAst|TStepParentAst
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
    noToggle,
    className,
    dropdownSx,
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
                sx={dropdownSx}
                noToggle={noToggle}
                initialExpand={initialExpand}
                id={`${parent.uuid}-${id || uuid}`}
                headerText={capitalize(label || type)}
                headerSx={{ flexDirection: `row-reverse` }}
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