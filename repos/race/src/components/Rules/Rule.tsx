import type { TStepAst, TRaceFeature, TRuleAst } from '@GBR/types'

import { useInline } from '@gobletqa/components'

import { Section } from '../Section'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { ESectionType } from '@GBR/types'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { copyRule } from '@GBR/actions/rule/copyRule'
import { EmptyScenarios, Scenarios } from '../Scenarios'

import { PlaylistPlusIcon } from '@gobletqa/components'
import { removeRule } from '@GBR/actions/rule/removeRule'
import { addRuleScenario } from '@GBR/actions/rule/addRuleScenario'

import { removeRuleScenario } from '@GBR/actions/rule/removeRuleScenario'
import { addRuleScenarioStep } from '@GBR/actions/rule/addRuleScenarioStep'
import { changeRuleScenarioStep } from '@GBR/actions/rule/changeRuleScenarioStep'
import { removeRuleScenarioStep } from '@GBR/actions/rule/removeRuleScenarioStep'


export type TRule = {
  rule: TRuleAst
  parent:TRaceFeature
}

export const Rule = (props:TRule) => {
  const { rule, parent } = props

  const onCopyRule = () => copyRule(rule)
  const onRemove = () => removeRule(rule.uuid)
  const onAddScenario = () => addRuleScenario(rule.uuid)
  const onAddStep = (scenarioId:string, ruleId?:string) => {
    addRuleScenarioStep(scenarioId, ruleId || rule.uuid)
  }
  const onRemoveScenario = (scenarioId:string, ruleId?:string) => {
     removeRuleScenario(scenarioId, ruleId || rule.uuid)
  }

  const onRemoveScenarioStep = useInline((stepId:string, scenarioId?:string, ruleId?:string) => {
    removeRuleScenarioStep(stepId, scenarioId, ruleId || rule.uuid)
  })

  const onChangeScenarioStep = useInline((step:TStepAst, scenarioId:string, ruleId?:string) => {
    changeRuleScenarioStep(step, scenarioId, ruleId || rule.uuid)
  })
  
  const onPlay = () => {}

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
            Icon={PlaylistPlusIcon}
            onClick={onAddScenario}
            type={ESectionType.scenario}
            key={`gr-rule-add-scenario-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gr-background-play-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyRule}
            type={ESectionType.rule}
            key={`gr-rule-copy-rule-action`}
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
        onChangeStep={onChangeScenarioStep}
        onRemoveStep={onRemoveScenarioStep}
      />
      <EmptyScenarios
        parent={rule}
        onAdd={onAddScenario}
      />
    </Section>
  )
}