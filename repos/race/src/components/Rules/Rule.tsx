import type { TRuleAst } from '@GBR/types'

import { AddItem } from '../AddItem'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { useEditor } from '../../contexts'
import { Section, SectionHeader } from '../Section'

export type TRule = {
  rule: TRuleAst
}

export const Rule = (props:TRule) => {
  const { rule } = props
  const { feature } = useEditor()

  return (
    <Section
      stack={1}
      type={ESectionType.rule}
    >
      <SectionHeader
        title={rule?.rule}
        type={ESectionType.rule}
      />
      <Scenarios
        parent={rule}
        scenarios={rule.scenarios}
      />
      <AddItem
        parentId={feature.uuid}
        type={ESectionType.rule}
      />
    </Section>
    )
}