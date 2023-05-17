import type { MouseEvent } from 'react'

import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
  TRaceBackground
} from '@GBR/types'

import { useCallback, useMemo } from 'react'
import { addScenario } from '@GBR/actions/scenario/addScenario'
import { createFeature } from '@GBR/actions/feature/createFeature'
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
  rootPrefix:string
  feature:TRaceFeature
}

export const useFeatureActions = (props:THFeatureActions) => {
  const {
    feature,
    rootPrefix
  } = props

  const onTagsChange = useCallback((...args:any) => {}, [])

  const onCreateFeature = useCallback((evt:MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()
    createFeature({}, rootPrefix)
  }, [rootPrefix])

  const childActions = useMemo(() => {
    
    const onRemoveBackground = () => removeBackground({parentId: feature.uuid})

    const onAddBackgroundStep = (parentId:string) => addBackgroundStep({
      granParent:feature,
      stepParentId: parentId
    })

    const onUpdateBackground = (background:TRaceBackground) => updateBackground({
      background,
      parentId: feature.uuid
    })

    const onRemoveBackgroundStep = (stepId:string, parentId:string) => removeBackgroundStep({
      stepId,
      granParent:feature,
      stepParentId:parentId
    })

    const onChangeBackgroundStep = (step:TRaceStep, parentId?:string) => updateBackgroundStep({
      step,
      granParent: feature,
      backgroundParentId: feature.uuid
    })

    const onAddScenario = () => addScenario({
      parentId: feature.uuid,
    })

    const onRemoveScenario = (scenarioId:string) => removeScenario({
      scenarioId,
      parent: feature
    })

    const onAddScenarioStep = (parentId:string) => addScenarioStep({
      granParent: feature,
      stepParentId: parentId
    })

    const onRemoveScenarioStep = (stepId:string, scenarioId?:string) => removeScenarioStep({
      stepId,
      granParent: feature,
      stepParentId: scenarioId
    })

    const onChangeScenario = (scenarioId:string, update:Partial<TRaceScenario>) => updateScenario({
      update,
      scenarioId,
      parent: feature
    })

    const onChangeScenarioStep = (step:TRaceStep, scenarioId:string) => updateScenarioStep({
      step,
      granParent: feature,
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

  return {
    onTagsChange,
    onCreateFeature,
    ...childActions
  }

}