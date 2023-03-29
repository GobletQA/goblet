import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground
} from '@GBR/types'

import { useMemo } from 'react'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { removeScenario } from '@GBR/actions/scenario/removeScenario'
import { updateScenario } from '@GBR/actions/scenario/updateScenario'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'
import { removeBackground } from '@GBR/actions/background/removeBackground'
import { updateBackground } from '@GBR/actions/background/updateBackground'
import { removeScenarioStep } from '@GBR/actions/scenario/removeScenarioStep'
import { updateScenarioStep } from '@GBR/actions/scenario/updateScenarioStep'
import { addBackgroundStep } from '@GBR/actions/background/addBackgroundStep'
import { removeBackgroundStep } from '@GBR/actions/background/removeBackgroundStep'
import { updateBackgroundStep } from '@GBR/actions/background/updateBackgroundStep'

export type THFeatureActions = {
  feature:TRaceFeature
}

export const useFeatureActions = (props:THFeatureActions) => {
  const {
    feature
  } = props

  return useMemo(() => {
    const onRemoveBackground = () => removeBackground({
      parentId: feature.uuid
    })

    const onAddBackgroundStep = (parentId:string) => addBackgroundStep({
      feature,
      stepParentId: parentId
    })

    const onUpdateBackground = (background:TRaceBackground) => updateBackground({
      feature,
      background,
      parentId: feature.uuid
    })

    const onRemoveBackgroundStep = (stepId:string, parentId:string) => removeBackgroundStep({
      stepId,
      feature,
      parent:feature,
      stepParentId:parentId
    })

    const onChangeBackgroundStep = (step:TRaceStep, parentId?:string) => updateBackgroundStep({
      step,
      feature,
      backgroundParentId: feature.uuid
    })

    const onAddScenario = () => addScenario({
      feature,
      parentId: feature.uuid,
    })

    const onRemoveScenario = (scenarioId:string) => removeScenario({
      feature,
      scenarioId,
      parent: feature
    })

    const onAddScenarioStep = (parentId:string) => addScenarioStep({
      feature,
      stepParentId: parentId
    })

    const onRemoveScenarioStep = (stepId:string, scenarioId?:string) => removeScenarioStep({
      stepId,
      feature,
      parent: feature,
      stepParentId: scenarioId
    })

    const onChangeScenario = (scenarioId:string, update:Partial<TRaceScenario>) => updateScenario({
      update,
      feature,
      scenarioId,
      parent: feature
    })

    const onChangeScenarioStep = (step:TRaceStep, scenarioId:string) => updateScenarioStep({
      step,
      feature,
      parent: feature,
      stepParentId: scenarioId,
    })
    
    return {
      onAddScenario,
      onRemoveScenario,
      onChangeScenario,
      onAddScenarioStep,
      onRemoveBackground,
      onUpdateBackground,
      onAddBackgroundStep,
      onRemoveScenarioStep,
      onChangeScenarioStep,
      onRemoveBackgroundStep,
      onChangeBackgroundStep,
    }

  }, [feature])

}