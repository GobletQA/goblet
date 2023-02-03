import type { TStepAst, TScenarioParentAst, TScenarioAst } from '@GBR/types'

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
  onChangeStep: (step:TStepAst, scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
} 

export const Scenarios = (props:TScenarios) => {

  const {
    parent,
    scenarios,
    onAdd,
    onRemove,
    onAddStep,
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