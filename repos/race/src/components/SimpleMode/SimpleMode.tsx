import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { Steps } from '../Steps'
import { uuid } from '@keg-hub/jsutils'
import { useMemo, useCallback } from 'react'
import { EAstObject } from '@ltipton/parkin'
import { EmptySteps } from '../Steps/EmptySteps'
import { SimpleScenarioTag } from '@GBR/constants'
import { EEditorMode, ESectionType } from '@GBR/types'
import { StepItem } from '@GBR/components/Feature/FeatureItems'
import { scenarioFactory } from '@GBR/factories/scenarioFactory'
import { EmptyFeature } from '@GBR/components/Feature/EmptyFeature'
import { findScenarioWithTag } from '@GBR/utils/find/findScenarioWithTag'
import { useScenarioActions } from '@GBR/hooks/actions/useScenarioActions'
import { addSimpleModeStep } from '@GBR/actions/general/addSimpleModeStep'

export type TSimpleMode = {
  parent:TRaceFeature
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onAdd: (parentId?:string, scenario?:Partial<TRaceScenario>) => void
  onChange :(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

const useEnsureScenario = ({ parent }:TSimpleMode) => {
  return useMemo(() => {

    if(parent?.scenarios?.length){
      const found = findScenarioWithTag(parent?.scenarios, SimpleScenarioTag)
      if(found) return found
    }

    return scenarioFactory({
      parent,
      empty: true,
      feature: parent,
      tags: [SimpleScenarioTag],
      scenario: {
        uuid: uuid(),
        scenario: `Steps`,
        type: EAstObject.scenario,
      },
    }) as TRaceScenario

  }, [
    parent.uuid,
    parent?.scenarios?.length
  ])
}

const useOnSimpleAdd = (props:TSimpleMode, scenario:TRaceScenario) => {
  const { parent } = props

  return useCallback(
    () => addSimpleModeStep({scenario, feature: parent}),
    [parent.uuid, scenario.uuid]
  )
}

export const SimpleMode = (props:TSimpleMode) => {
  const scenario = useEnsureScenario(props)
  const onAdd = useOnSimpleAdd(props, scenario)

  const {
    onMoveStep,
    onAddScenarioStep,
    onChangeScenarioStep,
    onRemoveScenarioStep,
  } = useScenarioActions({ ...props, scenario })

  return scenario && (
    <>
      {!scenario?.steps?.length ? (
        <EmptyFeature
          onAdd={onAdd}
          items={[StepItem]}
          parent={props.parent}
          mode={EEditorMode.simple}
        />
      ) : (
        <Steps
          showAdd={false}
          parent={scenario}
          gran={props.parent}
          onMove={onMoveStep}
          onAdd={onAddScenarioStep}
          onChange={onChangeScenarioStep}
          onRemove={onRemoveScenarioStep}
          parentType={ESectionType.scenario}
        >
          <EmptySteps
            parent={scenario}
            onAdd={onAddScenarioStep}
            parentType={ESectionType.scenario}
          />
        </Steps>
      )}
    </>
  ) || null
  
}