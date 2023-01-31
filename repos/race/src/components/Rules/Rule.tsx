import type { MouseEvent } from 'react'
import type { TRaceFeature, TRuleAst } from '@GBR/types'

import { Section } from '../Shared'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'
import { stopEvent, useInline } from '@gobletqa/components'

export type TRule = {
  rule: TRuleAst
  parent:TRaceFeature
}

export const Rule = (props:TRule) => {
  const { rule, parent } = props

  const onTrash = useInline((evt:MouseEvent) => {
    stopEvent(evt)
  })
  const onAddScenario = useInline(() => {
    
  })

  return (
    <Section
      parent={rule}
      onAdd={onAddScenario}
      initialExpand={false}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gr-rule-section'
      id={`${parent.uuid}-rule-${rule.uuid}`}
      actions={[
        Delete({
          onClick: onTrash,
          type: ESectionType.background,
        })
      ]}
    >
      <Scenarios
        parent={rule}
        scenarios={rule.scenarios}
      />
    </Section>
  )
}