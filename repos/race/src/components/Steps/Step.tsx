import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Section } from '../Section'
import { ESectionType } from '@GBR/types'
import { DeleteAct } from '../Actions/Delete'

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
        (
          <DeleteAct
            type={ESectionType.step}
            key={`gr-step-remove-action`}
            onClick={() => onRemove?.(step.uuid, parent.uuid)}
          />
        )
      ]}
    >
      {step?.type} - {step?.step}
    </Section>
  )
}