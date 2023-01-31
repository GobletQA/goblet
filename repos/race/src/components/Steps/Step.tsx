import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useEditor } from '../../contexts'
import { useInline } from '@gobletqa/components'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
}

export const Step = (props:TStep) => {
  const { step, parent } = props
  const { feature } = useEditor()

  const onAddStep = useInline(() => {})

  return (
    <Section
      parent={parent}
      onAdd={onAddStep}
      initialExpand={false}
      show={Boolean(step)}
      type={ESectionType.step}
      id={`${feature.uuid}-step`}
      className='gr-step-section'
    >
      {step?.type} - {step?.step}
    </Section>
  )
}