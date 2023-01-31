import type { MouseEvent } from 'react'
import type { TRaceFeature, TRuleAst } from '@GBR/types'

import { Section } from '../Shared'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'
import { stopEvent, useInline } from '@gobletqa/components'

import { removeRule } from '@GBR/actions/rule/removeRule'
import { addRuleScenario } from '@GBR/actions/rule/addRuleScenario'
import { removeRuleScenario } from '@GBR/actions/rule/removeRuleScenario'
import { addRuleScenarioStep } from '@GBR/actions/rule/addRuleScenarioStep'

export type TRule = {
  rule: TRuleAst
  parent:TRaceFeature
}

export const Rule = (props:TRule) => {
  const { rule, parent } = props

  const onTrash = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    removeRule(rule.uuid)
  })

  const onAddScenario = useInline(() => addRuleScenario(rule.uuid))
  const onAddStep = useInline((scenarioId:string, ruleId?:string) => {
    addRuleScenarioStep(scenarioId, ruleId || rule.uuid)
  })
  const onRemoveScenario = useInline((scenarioId:string, ruleId?:string) => {
     removeRuleScenario(scenarioId, ruleId || rule.uuid)
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
        onAddStep={onAddStep}
        onAdd={onAddScenario}
        scenarios={rule.scenarios}
        onRemove={onRemoveScenario}
      />
    </Section>
  )
}