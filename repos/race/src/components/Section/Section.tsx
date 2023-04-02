import type { TSectionAction } from './SectionActions'
import type { TRaceStepParent, TRaceScenarioParent } from '@GBR/types'
import type { CSSProperties, ReactNode, MutableRefObject } from 'react'

import { AddItem } from '../AddItem'
import { ESectionExt, ESectionType } from '@GBR/types'
import { useEditor } from '@GBR/contexts'
import { SectionActions } from './SectionActions'
import { Dropdown, Container } from './Section.styled'
import { wordCaps, cls, isStr } from '@keg-hub/jsutils'
import { SectionDragHandle } from './SectionDragHandle'

export type TSection = {
  id:string
  uuid?:string
  show?:boolean
  label?:ReactNode
  className?:string
  sx?:CSSProperties
  noToggle?:boolean
  Header?:ReactNode
  children:ReactNode
  formatHeader?:boolean
  showDragHandle?:boolean
  showExpandIcon?:boolean
  headerSx?:CSSProperties
  actions?:TSectionAction[]
  dropdownSx?:CSSProperties
  dragHandleSx?:CSSProperties
  type:ESectionType|ESectionExt
  headerContentSx?:CSSProperties
  onAdd?:(...args:any[]) => void
  dragHandleContainerSx?:CSSProperties
  parent:TRaceScenarioParent|TRaceStepParent
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
    showExpandIcon,
    showDragHandle,
    headerContentSx,
    formatHeader=true,
    dragHandleContainerSx,
  } = props

  const { expanded, updateExpanded } = useEditor()
  const hasDragHandle = Boolean(showDragHandle !== false && dragHandleRef)
  const onChange = (expand:boolean) => (expand !== expanded[id] && updateExpanded(id, expand))
  const isExpanded = expanded[id]

  return (
    <Container
      id={id}
      sx={sx}
      elevation={0}
      variant={`outlined`}
      className={cls(
        className,
        `gb-section-dropdown-container`,
        hasDragHandle && `gb-section-dnd`,
        isExpanded && `gb-section-dropdown-expanded`
      )}
    >
      {hasDragHandle && (
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
                onChange={onChange}
                noToggle={noToggle}
                headerSx={headerSx}
                expanded={isExpanded}
                showExpandIcon={showExpandIcon}
                headerContentSx={headerContentSx}
                id={`${parent.uuid}-${id || uuid}`}
                actions={<SectionActions actions={actions} />}
                headerText={isStr(label) && formatHeader ? wordCaps(label) : label}
                className={cls(
                  `gb-section-dropdown`,
                  `gb-section-dropdown-${type}`,
                  hasDragHandle && `gb-section-dropdown-dnd`
                )}
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