import { Scenario } from './Scenario'
import { AddItem } from '../AddItem'
import { ESectionType } from '../../types'
import { useFeature } from '../../contexts'

export type TScenarios = {
  
} 

export const Scenarios = (props:TScenarios) => {
  const { feature } = useFeature()

  const { scenarios } = feature

  return (
    <>
      {scenarios.map(scenario => {
        return (
          <Scenario
            scenario={scenario}
            key={`${feature.uuid}-${scenario.uuid}`}
          />
        )
      })}
      <AddItem
        parentId={feature.uuid}
        type={ESectionType.scenario}
      />
    </>
  )
}