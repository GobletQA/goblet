import type {
  TRaceStep,
  TRaceRule,
  TRaceScenario,
  TRaceBackground,
} from '@GBR/types'

import { useMemo } from 'react'
import { copyRule } from '@GBR/actions/rule/copyRule'
import { removeRule } from '@GBR/actions/rule/removeRule'

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

export type THRuleActions = {
  rule:TRaceRule
}

export const useRuleActions = (props:THRuleActions) => {
  const {
    rule,
  } = props

  return useMemo(() => {

    const onPlay = () => {}
    const onCopy = () => copyRule(rule)
    const onRemove = () => removeRule({
      ruleId: rule.uuid
    })

    const onAddBackground = () => addBackground({
      parentId: rule.uuid
    })

    const onRemoveBackground = () => removeBackground({
      parentId: rule.uuid
    })

    const onAddBackgroundStep = (parentId:string) => addBackgroundStep({
      granParent: rule,
      stepParentId: parentId
    })

    const onRemoveBackgroundStep = (stepId:string, parentId:string) => removeBackgroundStep({
      stepId,
      granParent: rule,
      stepParentId: parentId,
    })

    const onChangeBackground = (background:TRaceBackground) => updateBackground({
      background,
      parentId: rule.uuid
    })

    const onChangeBackgroundStep = (step:TRaceStep) => updateBackgroundStep({
      step,
      granParent: rule,
      backgroundParentId: rule.uuid
    })

    const onAddScenario = () => addScenario({
      parentId: rule.uuid,
    })

    const onAddScenarioStep = (parentId:string) => addScenarioStep({
      granParent: rule,
      stepParentId: parentId,
    })

    const onRemoveScenario = (scenarioId:string) => removeScenario({
      scenarioId,
      parent: rule
    })

    const onChangeScenario = (scenarioId:string, update:Partial<TRaceScenario>) => updateScenario({
      update,
      scenarioId,
      parent: rule
    })

    const onRemoveScenarioStep = (stepId:string, scenarioId?:string) => removeScenarioStep({
      stepId,
      granParent: rule,
      stepParentId: scenarioId,
    })

    const onChangeScenarioStep = (step:TRaceStep, scenarioId:string) => updateScenarioStep({
      step,
      granParent: rule,
      stepParentId: scenarioId,
    })

    return {
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
    }
  }, [rule])
}