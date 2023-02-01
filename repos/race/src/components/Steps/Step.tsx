import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
  onRemove?:(stepId:string, parentId?:string) => void
}

export const Step = (props:TStep) => {
  const { onRemove, step, parent } = props
  const onAddStep = () => {}

  return (
    <Section
      parent={parent}
      onAdd={onAddStep}
      initialExpand={false}
      show={Boolean(step)}
      type={ESectionType.step}
      id={`${parent.uuid}-step`}
      className='gr-step-section'
      actions={[
        Delete({
          type: ESectionType.step,
          onClick: () => onRemove?.(step.uuid, parent.uuid),
        })
      ]}
    >
      {step?.type} - {step?.step}
    </Section>
  )
}