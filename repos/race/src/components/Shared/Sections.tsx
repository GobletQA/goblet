import type { ReactNode, ComponentProps } from 'react'
import type { TStepParentAst, TScenarioParentAst } from '@GBR/types'

import { Section } from './Section'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'

export type TSections = {
  type:ESectionType
  showAdd?:boolean
  children?:ReactNode
  onAdd?:(...args:any[]) => void
  items?:ComponentProps<typeof Section>[]
  parent:TScenarioParentAst | TStepParentAst
} 

export const Sections = (props:TSections) => {

  const {
    type,
    items,
    onAdd,
    parent,
    showAdd,
    children,
  } = props

  return (
    <>
      {children || items?.map(item => {
        return (
          <Section
            {...item}
            key={`${parent.uuid}-${item.uuid}`}
          />
        )
      })}

      {showAdd && onAdd && (
        <AddItem
          type={type}
          onClick={onAdd}
          parentId={parent.uuid}
          className={`gr-section-add-item gr-section-add-${type}`}
        />
      ) || null}
    </>
  )
}