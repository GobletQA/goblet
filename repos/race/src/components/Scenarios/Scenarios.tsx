import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'

import { Sections } from '../Shared'
import { Scenario } from './Scenario'
import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { addScenario } from '@GBR/actions/scenario/addScenario'

export type TScenarios = {
  scenarios?:TScenarioAst[]
  parent:TScenarioParentAst
} 

export const Scenarios = (props:TScenarios) => {

  const { scenarios, parent } = props
  const onAdd = useInline(() => addScenario())

  return (
    <Sections
      onAdd={onAdd}
      showAdd={true}
      parent={parent}
      type={ESectionType.scenario}
    >
    {
      scenarios?.map(scenario => {
        return (
          <Scenario
            parent={parent}
            scenario={scenario}
            key={`${parent.uuid}-scenario-${scenario.uuid}`}
          />
        )
      })
    }
    </Sections>
  )
}