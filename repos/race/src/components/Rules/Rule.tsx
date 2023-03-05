import type { TStepAst, TRuleAst } from '@ltipton/parkin'
import type { TRaceFeature } from '@GBR/types'

import { useInline } from '@gobletqa/components'

import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../General/EditTitle'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { copyRule } from '@GBR/actions/rule/copyRule'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { EmptyScenarios, Scenarios } from '../Scenarios'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'

import { PlaylistPlusIcon } from '@gobletqa/components'
import { removeRule } from '@GBR/actions/rule/removeRule'
import { addRuleScenario } from '@GBR/actions/rule/addRuleScenario'

import { updateRule } from '@GBR/actions/rule/updateRule'
import { removeRuleScenario } from '@GBR/actions/rule/removeRuleScenario'
import { addRuleScenarioStep } from '@GBR/actions/rule/addRuleScenarioStep'
import { changeRuleScenarioStep } from '@GBR/actions/rule/changeRuleScenarioStep'
import { removeRuleScenarioStep } from '@GBR/actions/rule/removeRuleScenarioStep'


export type TRule = {
  rule: TRuleAst
  parent:TRaceFeature
}

const styles = {
  title: {
    marginTop:`10px`,
    marginBottom:`30px`,
    padding: `0px 10px`,
  }
}


export const Rule = (props:TRule) => {
  const { rule, parent } = props

  const {
    isNamed,
    showTitle,
    onEditTitle,
    sectionTitle,
    editingTitle,
    toggleEditTitle,
  } = useEditSectionTitle({
    title: rule.rule,
    key: EGherkinKeys.rule,
    callback: (update?:string) => {
      rule.rule !== update
        && updateRule(rule.uuid, { rule: update })
    },
  })

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
      label={
        isNamed
          ? (
              <SectionHeader
                content={sectionTitle}
                type={ESectionType.rule}
              />
            )
          : undefined
      }
      actions={[
        (
          <EditTitleAct
            label={`Description`}
            editing={editingTitle}
            onClick={toggleEditTitle}
            type={ESectionType.rule}
            key={`gr-rule-edit-title-action`}
          />
        ),
        (
          <AddAct
            Icon={PlaylistPlusIcon}
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
        (
          <CopyAct
            onClick={onCopyRule}
            type={ESectionType.rule}
            key={`gr-rule-copy-rule-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gr-background-play-action`}
          />
        ),
      ]}
    >
    
    {showTitle && (
      <EditTitle
        sx={styles.title}
        uuid={rule.uuid}
        value={sectionTitle}
        label={`Description`}
        onChange={onEditTitle}
        type={ESectionType.rule}
      />
    )}
    
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