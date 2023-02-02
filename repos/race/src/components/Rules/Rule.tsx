import type { TRaceFeature, TRuleAst } from '@GBR/types'

import { Section } from '../Shared'
import { AddAct } from '../Actions/Add'
import { Scenarios } from '../Scenarios'
import { ESectionType } from '@GBR/types'
import { DeleteAct } from '../Actions/Delete'

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

  const onRemove = () => removeRule(rule.uuid)
  const onAddScenario = () => addRuleScenario(rule.uuid)
  const onAddStep = (scenarioId:string, ruleId?:string) => {
    addRuleScenarioStep(scenarioId, ruleId || rule.uuid)
  }
  const onRemoveScenario = (scenarioId:string, ruleId?:string) => {
     removeRuleScenario(scenarioId, ruleId || rule.uuid)
  }

  return (
    <Section
      parent={rule}
      initialExpand={true}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gr-rule-section'
      id={`${parent.uuid}-rule-${rule.uuid}`}
      actions={[
        (
          <AddAct
            onClick={onAddScenario}
            type={ESectionType.scenario}
            key={`gr-rule-add-scenario-action`}
          />
        ),
        (
          <DeleteAct
            onClick={onRemove}
            type={ESectionType.rule}
            key={`gr-rule-removed-scenario-action`}
          />
        ),
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