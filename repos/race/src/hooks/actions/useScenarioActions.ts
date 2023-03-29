import type { TRaceScenarioParent, TRaceScenario, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
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

    const onPlay = () => {}

    const onCopyScenario = () => copyScenario(scenario)
    const onRemoveScenario = () => onRemove(scenario.uuid, parent.uuid)
    const onAddScenarioStep = () => onAddStep(scenario.uuid, parent.uuid)
    const onChangeScenarioStep = (step:TRaceStep) => onChangeStep(step, scenario.uuid, parent.uuid)
    const onRemoveScenarioStep = (stepId:string) => onRemoveStep(stepId, scenario.uuid, parent.uuid)
    const onMoveStep = (scenarioId:string, oldIdx:number, newIdx:number,) => updateScenarioStepPos({
      oldIdx,
      newIdx,
      scenarioId,
      scenarioParentId: parent.uuid,
    })
    
    return {
      onPlay,
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