import type { TRaceFeature, TRuleAst } from '@GBR/types'

import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Section, Stack } from '../Shared'
import { stopEvent, IconButton, TrashIcon, useInline } from '@gobletqa/components'

export type TRule = {
  rule: TRuleAst
  parent:TRaceFeature
}

export const Rule = (props:TRule) => {
  const { rule, parent } = props

  const onAddScenario = useInline(() => {})

  return (
    <Section
      parent={rule}
      onAdd={onAddScenario}
      initialExpand={false}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gr-rule-section'
      id={`${parent.uuid}-rule-${rule.uuid}`}
      // actions={[
      //   <IconButton
      //     key='trash-story'
      //     Icon={TrashIcon}
      //     onClick={onTrash}
      //   />
      // ]}
    >
      <Scenarios
        parent={rule}
        scenarios={rule.scenarios}
      />
    </Section>
  )
}