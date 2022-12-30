import type { TRuleAst } from '@GBR/types'

import { AddItem } from '../AddItem'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { useFeature } from '../../contexts'
import { capitalize } from '@keg-hub/jsutils'
import { Section, SectionHeader } from '../Section'

export type TRule = {
  rule: TRuleAst
}

export const Rule = (props:TRule) => {
  const { rule } = props
  const { feature } = useFeature()

  return (
    <Section
      stack={1}
      type={ESectionType.scenario}
    >
      <SectionHeader
        underline={true}
        type={ESectionType.rule}
        title={rule?.rule.trim() ||capitalize(ESectionType.rule)}
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