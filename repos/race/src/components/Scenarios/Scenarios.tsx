import type { TRaceScenarioParent, TRaceScenario, TRaceStep } from '@GBR/types'

import { Sections } from '../Section'
import { Scenario } from './Scenario'
import { ESectionType } from '@GBR/types'
import { generateId } from '@GBR/utils/helpers/generateId'

export type TScenarios = {
  scenarios?:TRaceScenario[]
  parent:TRaceScenarioParent
  onAdd: (parentId?:string) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange :(scenarioId:string, update:Partial<TRaceScenario>) => void
  onChangeStep: (step:TRaceStep, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const Scenarios = (props:TScenarios) => {

  const {
    parent,
    onAdd,
    onChange,
    onRemove,
    onAddStep,
    scenarios,
    onChangeStep,
    onRemoveStep
  } = props

  return (
    <Sections
      onAdd={onAdd}
      showAdd={false}
      parent={parent}
      type={ESectionType.scenario}
    >
    {
      scenarios?.map((scenario, idx) => {
        const scenarioId = generateId(parent, scenario, ESectionType.scenario)

        return (
          <Scenario
            parent={parent}
            key={scenarioId}
            onRemove={onRemove}
            scenario={scenario}
            onChange={onChange}
            onAddStep={onAddStep}
            scenarioId={scenarioId}
            onChangeStep={onChangeStep}
            onRemoveStep={onRemoveStep}
          />
        )
      })
    }
    </Sections>
  )
}