import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'
import { Scenario } from './Scenario'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'


export type TScenarios = {
  scenarios?:TScenarioAst[]
  parent:TScenarioParentAst
} 

export const Scenarios = (props:TScenarios) => {

  const { scenarios, parent } = props

  return (
    <>
      {scenarios?.map(scenario => {
        return (
          <Scenario
            scenario={scenario}
            key={`${parent.uuid}-${scenario.uuid}`}
          />
        )
      })}
      <AddItem
        parentId={parent.uuid}
        type={ESectionType.scenario}
      />
    </>
  )
}