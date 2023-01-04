import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'
import { Scenario } from './Scenario'
import { AddItem } from '../AddItem'
import { Section } from '../Section'
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
      <Section
        sx={{ marginTop: `20px` }}
        type={ESectionType.scenario}
      >
        <AddItem
          parentId={parent.uuid}
          sx={{ marginLeft: `-10px` }}
          type={ESectionType.scenario}
        />
      </Section>
    </>
  )
}