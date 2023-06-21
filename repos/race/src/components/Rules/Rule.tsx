import type { TRaceRule, TRaceFeature } from '@GBR/types'

import { EditTitle } from '../Title/EditTitle'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { EmptyScenarios, Scenarios } from '../Scenarios'
import { updateRule } from '@GBR/actions/rule/updateRule'
import { useRuleActions } from '@GBR/hooks/actions/useRuleActions'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { useSectionActions } from '@GBR/hooks/editor/useSectionActions'
import { EmptyBackground, Background } from '@GBR/components/Background'

export type TRule = {
  ruleId:string
  rule: TRaceRule
  feature:TRaceFeature
}

export const Rule = (props:TRule) => {
  const {
    rule,
    ruleId,
    feature,
  } = props

  const {
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
        && updateRule({
            feature,
            ruleId: rule.uuid,
            update: { rule: update }
          })
    },
  })
  
  const actions = useSectionActions({
    onCopy,
    onRemove,
    item: rule,
    onAddScenario,
    onAddBackground,
    editingTitle,
    toggleEditTitle,
    type: ESectionType.rule,
  })

  return (
    <Section
      id={ruleId}
      parent={rule}
      actions={actions}
      show={Boolean(rule)}
      type={ESectionType.rule}
      className='gb-rule-section'
      label={(
        <SectionHeader
          id={rule.uuid}
          content={sectionTitle}
          type={ESectionType.rule}
        />
      )}
    >
      {showTitle && (
        <EditTitle
          uuid={rule.uuid}
          value={sectionTitle}
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
      {isNamed && !rule?.scenarios?.length && (
        <EmptyScenarios
          parent={rule}
          onAdd={onAddScenario}
          parentType={ESectionType.rule}
        />
      ) || null}
    </Section>
  )
}