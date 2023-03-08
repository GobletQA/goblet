import type { TScenarioParentAst } from '@GBR/types'
import type { TScenarioAst, TStepAst } from '@ltipton/parkin'

import { Sections } from '../Section'
import { Scenario } from './Scenario'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'

export type TScenarios = {
  scenarios?:TScenarioAst[]
  parent:TScenarioParentAst
  onAdd: (parentId?:string) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onChange :(scenarioId:string, update:Partial<TScenarioAst>) => void
  onChangeStep: (step:TStepAst, scenarioId:string, parentId?:string) => void
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
      scenarios?.map(scenario => {
        return (
          <Scenario
            parent={parent}
            onRemove={onRemove}
            scenario={scenario}
            onChange={onChange}
            onAddStep={onAddStep}
            onChangeStep={onChangeStep}
            onRemoveStep={onRemoveStep}
            key={`${parent.uuid}-scenario-${scenario.uuid}`}
          />
        )
      })
    }
    </Sections>
  )
}