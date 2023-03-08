import type { TScenarioAst, TBackgroundAst, TStepAst, TRuleAst } from '@ltipton/parkin'
import type { TRaceFeature } from '@GBR/types'

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
import { EmptyBackground, Background } from '@GBR/components/Background'
import { removeRuleScenario } from '@GBR/actions/rule/removeRuleScenario'
import { updateRuleScenario } from '@GBR/actions/rule/updateRuleScenario'
import { addRuleScenarioStep } from '@GBR/actions/rule/addRuleScenarioStep'
import { updateRuleScenarioStep } from '@GBR/actions/rule/updateRuleScenarioStep'
import { removeRuleScenarioStep } from '@GBR/actions/rule/removeRuleScenarioStep'

import { addRuleBackground } from '@GBR/actions/rule/addRuleBackground'
import { removeRuleBackground } from '@GBR/actions/rule/removeRuleBackground'
import { addRuleBackgroundStep } from '@GBR/actions/rule/addRuleBackgroundStep'
import { updateRuleBackgroundStep } from '@GBR/actions/rule/updateRuleBackgroundStep'
import { removeRuleBackgroundStep } from '@GBR/actions/rule/removeRuleBackgroundStep'
import { updateRuleBackground } from '@gobletqa/race/actions/rule/updateRuleBackground'


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

  const onPlay = () => {}
  const onCopyRule = () => copyRule(rule)
  const onRemove = () => removeRule(rule.uuid)

  const onRemoveBackground = () => removeRuleBackground(rule.uuid)
  const onChangeBackgroundStep = (step:TStepAst) => updateRuleBackgroundStep(step, rule.uuid)
  const onRemoveBackgroundStep = (stepId:string) => removeRuleBackgroundStep(stepId, rule.uuid)
  const onChangeBackground = (background:TBackgroundAst) => updateRuleBackground(background, rule.uuid)

  const onAddScenario = () => addRuleScenario(rule.uuid)
  const onAddStep = (scenarioId:string) => addRuleScenarioStep(scenarioId, rule.uuid)
  const onRemoveScenario = (scenarioId:string) => removeRuleScenario(scenarioId, rule.uuid)
  const onChangeScenario = (scenarioId:string, update:Partial<TScenarioAst>) => updateRuleScenario(
    scenarioId,
    update,
    rule.uuid
  )
  const onRemoveScenarioStep = (stepId:string, scenarioId?:string) => removeRuleScenarioStep(
    stepId,
    scenarioId,
    rule.uuid
  )
  const onChangeScenarioStep = (step:TStepAst, scenarioId:string) => updateRuleScenarioStep(
    step,
    scenarioId,
    rule.uuid
  )
  

  return (
    <Section
      parent={rule}
      initialExpand={true}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gr-rule-section'
      id={`${parent.uuid}-rule-${rule.uuid}`}
      label={(
        <SectionHeader
          content={sectionTitle}
          type={ESectionType.rule}
        />
      )}
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
      ) || null}

      {rule?.background
        ? (
            <Background
              parent={rule}
              background={rule.background}
              onAddStep={addRuleBackgroundStep}
              onRemove={onRemoveBackground}
              onChange={onChangeBackground}
              onChangeStep={onChangeBackgroundStep}
              onRemoveStep={onRemoveBackgroundStep}
            />
          )
        : isNamed && (
            <EmptyBackground
              parent={rule}
              onAdd={addRuleBackground}
              parentType={ESectionType.rule}
            />
          ) || null
      }

      <Scenarios
        parent={rule}
        onAddStep={onAddStep}
        onAdd={onAddScenario}
        scenarios={rule.scenarios}
        onChange={onChangeScenario}
        onRemove={onRemoveScenario}
        onChangeStep={onChangeScenarioStep}
        onRemoveStep={onRemoveScenarioStep}
      />
      {isNamed && (
        <EmptyScenarios
          parent={rule}
          onAdd={onAddScenario}
          parentType={ESectionType.rule}
        />
      ) || null}
    </Section>
  )
}