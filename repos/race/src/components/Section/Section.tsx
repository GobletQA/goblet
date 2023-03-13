import type { TSectionAction } from './SectionActions'
import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'
import type { CSSProperties, ReactNode, MutableRefObject } from 'react'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { SectionActions } from './SectionActions'
import { Dropdown, Container } from './Section.styled'
import { wordCaps, cls, isStr } from '@keg-hub/jsutils'
import { SectionDragHandle } from './SectionDragHandle'


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
  dragHandleSx?:CSSProperties
  headerContentSx?:CSSProperties
  onAdd?:(...args:any[]) => void
  dragHandleContainerSx?:CSSProperties
  parent:TScenarioParentAst|TStepParentAst
  dragHandleRef?: MutableRefObject<HTMLDivElement>
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
    dragHandleSx,
    dragHandleRef,
    initialExpand,
    headerContentSx,
    formatHeader=true,
    dragHandleContainerSx,
  } = props

  return (
    <Container
      sx={sx}
      elevation={0}
      id={id || uuid}
      className={cls(`gb-section-dropdown-container`, className)}
    >
      {dragHandleRef && (
        <SectionDragHandle
          type={type}
          sx={dragHandleSx}
          dragHandleRef={dragHandleRef}
          containerSx={dragHandleContainerSx}
        />
      )}
    
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
                className={cls(`gb-section-dropdown`, `gb-section-dropdown-${type}`)}
              >
                {children}
              </Dropdown>
            )
          : onAdd && (
              <AddItem
                type={type}
                onClick={onAdd}
                parentId={parent.uuid as string}
                className={`gb-section-add-item gb-section-add-${type}`}
              />
            ) || null
      }
    </Container>
  )
}