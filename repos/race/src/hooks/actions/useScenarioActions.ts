import type { TAnyCB, TRaceScenarioParent, TRaceScenario, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { EDndPos } from '@gobletqa/components'
import { useOperations } from '@gobletqa/race/contexts'
import { copyScenario } from '@GBR/actions/scenario/copyScenario'
import { pasteOperation } from '@GBR/actions/operations/pasteOperation'
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
    onAdd,
    scenario,
    onRemove,
    onAddStep,
    onChange,
    onChangeStep,
    onRemoveStep
  } = props

  const { operations } = useOperations()

  return useMemo(() => {

    const onChangeScenarioStep = onChangeStep
    const onRemoveScenarioStep = onRemoveStep

    const onPasteStep = (
      operations?.paste
        && (operations?.paste as TRaceStep)?.step
        && (() => pasteOperation({ parent: scenario, child: operations?.paste, gran: parent }))
    ) as TAnyCB

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
      onPasteStep,
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
    operations.paste
  ])
  
}