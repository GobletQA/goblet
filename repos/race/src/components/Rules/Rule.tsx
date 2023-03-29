import type {
  TRaceRule,
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground,
} from '@GBR/types'


import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../Title/EditTitle'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { copyRule } from '@GBR/actions/rule/copyRule'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { EmptyScenarios, Scenarios } from '../Scenarios'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'

import { removeRule } from '@GBR/actions/rule/removeRule'
import { updateRule } from '@GBR/actions/rule/updateRule'
import { PlaylistPlusIcon, CardPlusIcon } from '@gobletqa/components'
import { EmptyBackground, Background } from '@GBR/components/Background'

import { addScenario } from '@GBR/actions/scenario/addScenario'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { updateScenario } from '@GBR/actions/scenario/updateScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'
import { updateScenarioStep } from '@GBR/actions/scenario/updateScenarioStep'

import { addBackground } from '@GBR/actions/background/addBackground'
import { removeBackground } from '@GBR/actions/background/removeBackground'
import { updateBackground } from '@GBR/actions/background/updateBackground'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'
import { updateBackgroundStep } from '@GBR/actions/background/updateBackgroundStep'

export type TRule = {
  ruleId:string
  rule: TRaceRule
  feature:TRaceFeature
}

const styles = {
  title: {
    marginTop:`10px`,
    marginBottom:`30px`,
    padding: `0px 10px`,
  }
}


export const Rule = (props:TRule) => {
  const {
    rule,
    ruleId,
    feature,
  } = props

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

  const onAddBackground = () => addBackground({
    parentId: rule.uuid
  })

  const onRemoveBackground = () => removeBackground({
    feature,
    parentId: rule.uuid
  })

  const onAddBackgroundStep = (parentId:string) => addBackgroundStep({
    feature,
    stepParentId: parentId
  })

  const onRemoveBackgroundStep = (stepId:string, parentId:string) => removeBackgroundStep({
    stepId,
    feature,
    parent: rule,
    stepParentId: parentId,
  })

  const onChangeBackground = (background:TRaceBackground) => updateBackground({
    feature,
    background,
    parentId: rule.uuid
  })

  const onChangeBackgroundStep = (step:TRaceStep) => updateBackgroundStep({
    step,
    feature,
    backgroundParentId: rule.uuid
  })

  const onAddScenario = () => addScenario({
    feature,
    parentId: rule.uuid,
  })

  const onAddScenarioStep = (parentId:string) => addScenarioStep({
    feature,
    stepParentId: parentId,
  })

  const onRemoveScenario = (scenarioId:string) => removeScenario({
    feature,
    scenarioId,
    parent: rule
  })

  const onChangeScenario = (scenarioId:string, update:Partial<TRaceScenario>) => updateScenario({
    update,
    feature,
    scenarioId,
    parent: rule
  })

  const onRemoveScenarioStep = (stepId:string, scenarioId?:string) => removeScenarioStep({
    stepId,
    feature,
    parent: rule,
    stepParentId: scenarioId,
  })

  const onChangeScenarioStep = (step:TRaceStep, scenarioId:string) => updateScenarioStep({
    step,
    feature,
    parent: rule,
    stepParentId: scenarioId,
  })

  return (
    <Section
      parent={rule}
      id={ruleId}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gb-rule-section'
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
            key={`gb-rule-edit-title-action`}
          />
        ),
        (
          <AddAct
            Icon={CardPlusIcon}
            onClick={onAddBackground}
            type={ESectionType.background}
            key={`gb-rule-add-background-action`}
          />
        ),
        (
          <AddAct
            Icon={PlaylistPlusIcon}
            onClick={onAddScenario}
            type={ESectionType.scenario}
            key={`gb-rule-add-scenario-action`}
          />
        ),
        (
          <DeleteAct
            onClick={onRemove}
            type={ESectionType.rule}
            key={`gb-rule-removed-scenario-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyRule}
            type={ESectionType.rule}
            key={`gb-rule-copy-rule-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gb-background-play-action`}
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
          onBlur={onEditTitle}
          type={ESectionType.rule}
        />
      ) || null}

      {rule?.background
        ? (
            <Background
              parent={rule}
              background={rule.background}
              onRemove={onRemoveBackground}
              onChange={onChangeBackground}
              onAddStep={onAddBackgroundStep}
              onChangeStep={onChangeBackgroundStep}
              onRemoveStep={onRemoveBackgroundStep}
            />
          )
        : isNamed && (
            <EmptyBackground
              parent={rule}
              onAdd={onAddBackground}
              parentType={ESectionType.rule}
            />
          ) || null
      }

      <Scenarios
        parent={rule}
        onAdd={onAddScenario}
        scenarios={rule.scenarios}
        onChange={onChangeScenario}
        onRemove={onRemoveScenario}
        onAddStep={onAddScenarioStep}
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