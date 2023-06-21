import type { TRaceScenarioParent, TRaceScenario, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { EDndPos } from '@gobletqa/components'
import { copyScenario } from '@GBR/actions/scenario/copyScenario'
import { updateScenarioStepPos } from '@GBR/actions/scenario/updateScenarioStepPos'

export type THScenarioActions = {
  scenario:TRaceScenario
  parent:TRaceScenarioParent
  onAdd?: (...args:any[]) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange:(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const useScenarioActions = (props:THScenarioActions) => {
  const {
    parent,
    scenario,
    onAdd,
    onRemove,
    onAddStep,
    onChange,
    onChangeStep,
    onRemoveStep
  } = props

  return useMemo(() => {

    const onChangeScenarioStep = onChangeStep
    const onRemoveScenarioStep = onRemoveStep

    const onCopyScenario = () => copyScenario(scenario)
    const onRemoveScenario = () => onRemove(scenario.uuid, parent.uuid)
    const onAddScenarioStep = () => onAddStep(scenario.uuid, parent.uuid)
    const onMoveStep = (
      scenarioId:string,
      oldIdx:number,
      newIdx:number,
      pos:EDndPos
    ) => updateScenarioStepPos({
      pos,
      oldIdx,
      newIdx,
      scenarioId,
      granParent: parent,
      scenarioParentId: parent.uuid,
    })
    
    return {
      onMoveStep,
      onCopyScenario,
      onRemoveScenario,
      onAddScenarioStep,
      onChangeScenarioStep,
      onRemoveScenarioStep,
    }
  }, [
    onAdd,
    parent,
    scenario,
    onChange,
    onRemove,
    onAddStep,
    onRemoveStep,
    onChangeStep,
  ])
  
}