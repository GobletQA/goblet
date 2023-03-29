import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../Title/EditTitle'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { EmptyScenarios, Scenarios } from '../Scenarios'
import { updateRule } from '@GBR/actions/rule/updateRule'
import { useRuleActions } from '@GBR/hooks/actions/useRuleActions'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { PlaylistPlusIcon, CardPlusIcon } from '@gobletqa/components'
import { EmptyBackground, Background } from '@GBR/components/Background'

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
  } = props

  const {
    onPlay,
    onCopy,
    onRemove,
    onAddScenario,
    onAddBackground,
    onRemoveScenario,
    onChangeScenario,
    onAddScenarioStep,
    onRemoveBackground,
    onChangeBackground,
    onAddBackgroundStep,
    onRemoveScenarioStep,
    onChangeScenarioStep,
    onRemoveBackgroundStep,
    onChangeBackgroundStep,
  } = useRuleActions({ rule })

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
            onClick={onCopy}
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