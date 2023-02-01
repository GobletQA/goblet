import type { ReactNode } from 'react'
import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Step } from './Step'
import { Sections } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'


export type TStep = {
  steps?:TStepAst[]
  showAdd?:boolean
  children?:ReactNode
  parent:TStepParentAst
  onAdd?:(parentId:string) => void
  onRemove?:(stepId:string, parentId?:string) => void
} 

export const Steps = (props:TStep) => {

  const {
    onAdd,
    parent,
    onRemove,
    children,
    showAdd=true,
  } = props
  const onAddStep = useInline(() => onAdd?.(parent.uuid))

  return (
    <Sections
      parent={parent}
      showAdd={showAdd}
      onAdd={onAddStep}
      type={ESectionType.step}
    >
      {
        parent?.steps?.map(step => {
          return (
            <Step
              step={step}
              parent={parent}
              onRemove={onRemove}
              key={`${parent.uuid}-step-${step.uuid}`}
            />
          )
        })
      }
      {children}
    </Sections>
  )
}