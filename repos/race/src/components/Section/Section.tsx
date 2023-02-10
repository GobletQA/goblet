import type { CSSProperties, ReactNode } from 'react'
import type { TSectionAction } from './SectionActions'
import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { SectionActions } from './SectionActions'
import { Dropdown, Container } from './Section.styled'
import { wordCaps, cls, isStr } from '@keg-hub/jsutils'


export type TSection = {
  id?:string
  uuid?:string
  show?:boolean
  label?:ReactNode
  type:ESectionType
  className?:string
  sx?:CSSProperties
  noToggle?:boolean
  Header?:ReactNode
  children:ReactNode
  formatHeader?:boolean
  initialExpand?:boolean
  actions?:TSectionAction[]
  headerSx?:CSSProperties
  dropdownSx?:CSSProperties
  headerContentSx?:CSSProperties
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
    onAdd,
    parent,
    Header,
    actions,
    children,
    noToggle,
    headerSx,
    className,
    label=type,
    dropdownSx,
    initialExpand,
    headerContentSx,
    formatHeader=true
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
                Header={Header}
                noToggle={noToggle}
                headerSx={headerSx}
                initialExpand={initialExpand}
                headerContentSx={headerContentSx}
                id={`${parent.uuid}-${id || uuid}`}
                actions={<SectionActions actions={actions} />}
                headerText={isStr(label) && formatHeader ? wordCaps(label) : label}
                className={cls(`gr-section-dropdown`, `gr-section-dropdown-${type}`)}
              >
                {children}
              </Dropdown>
            )
          : onAdd && (
              <AddItem
                type={type}
                onClick={onAdd}
                parentId={parent.uuid as string}
                className={`gr-section-add-item gr-section-add-${type}`}
              />
            ) || null
      }
    </Container>
  )
}