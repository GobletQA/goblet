import type {
  TRaceStep,
  TRaceFeature,
  TRaceScenario,
} from '@GBR/types'

import { Steps } from '../Steps'
import { EmptySteps } from '../Steps/EmptySteps'
import { EEditorMode, ESectionType } from '@GBR/types'
import { StepItem } from '@GBR/components/Feature/FeatureItems'
import { EmptyFeature } from '@GBR/components/Feature/EmptyFeature'
import { useScenarioActions } from '@GBR/hooks/actions/useScenarioActions'

export type TSimpleMode = {
  parent:TRaceFeature
  onSimpleAdd:() => void
  scenario:TRaceScenario
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onAdd: (parentId?:string, scenario?:Partial<TRaceScenario>) => void
  onChange :(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const SimpleMode = (props:TSimpleMode) => {
  const {
    scenario,
    onSimpleAdd
  } = props

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
          items={[StepItem]}
          onAdd={onSimpleAdd}
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