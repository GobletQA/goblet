import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { useMemo } from 'react'
import { Steps } from '../Steps'
import { EAstObject } from '@ltipton/parkin'
import { EmptySteps } from '../Steps/EmptySteps'
import { SimpleScenarioTitle } from '@GBR/constants'
import { EEditorMode, ESectionType } from '@GBR/types'
import { EmptyFeature } from '@GBR/components/Feature/EmptyFeature'
import { useScenarioActions } from '@GBR/hooks/actions/useScenarioActions'

export type TSimpleMode = {
  parent:TRaceFeature
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onAdd: (parentId?:string, scenario?:Partial<TRaceScenario>) => void
  onChange :(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

const useEnsureScenario = ({ parent, onAdd }:TSimpleMode) => {
  const scenario = parent?.scenarios?.[0] 
  
  return useMemo(() => {
    return scenario
      || ({
          steps: [],
          type: EAstObject.scenario,
          uuid: SimpleScenarioTitle,
          scenario: SimpleScenarioTitle,
        })
  }, [scenario])
}

export const SimpleMode = (props:TSimpleMode) => {
  const scenario = useEnsureScenario(props)

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
          items={[]}
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