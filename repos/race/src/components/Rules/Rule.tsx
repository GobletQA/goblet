import type { TRuleAst } from '@GBR/types'

import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { useEditor } from '../../contexts'
import { Section, Stack } from '../Shared'
import { stopEvent, IconButton, TrashIcon, useInline } from '@gobletqa/components'

export type TRule = {
  rule: TRuleAst
}

export const Rule = (props:TRule) => {
  const { rule } = props
  const { feature } = useEditor()

  const onAddScenario = useInline(() => {})

  return (
    <Section
      parent={rule}
      onAdd={onAddScenario}
      initialExpand={false}
      show={Boolean(rule)}
      type={ESectionType.rule}
      id={`${feature.uuid}-rule`}
      className='gr-rule-section'
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