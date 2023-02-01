import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { Add } from '../Actions/Add'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'


export type TScenario = {
  scenario: TScenarioAst
  parent: TScenarioParentAst
  onAdd?: (...args:any[]) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
  onRemoveStep: (stepId:string, scenarioId?:string, parentId?:string) => void
}

export const Scenario = (props:TScenario) => {
  const { onRemoveStep, onAddStep, onRemove, scenario, parent } = props

  const onRemoveScenario = () => onRemove(scenario.uuid, parent.uuid)
  const onAddScenarioStep = () => onAddStep(scenario.uuid, parent.uuid)
  const onRemoveScenarioStep = (stepId:string) => onRemoveStep(stepId, scenario.uuid, parent.uuid)

  return (
    <Section
      parent={parent}
      initialExpand={false}
      show={Boolean(scenario)}
      onAdd={onAddScenarioStep}
      type={ESectionType.scenario}
      id={`${parent.uuid}-scenario`}
      className='gr-scenario-section'
      actions={[
        Add({
          onClick: onAddScenarioStep,
          type: ESectionType.scenario,
        }),
        Delete({
          onClick: onRemoveScenario,
          type: ESectionType.scenario,
        })
      ]}
    >
      <Steps
        parent={scenario}
        onAdd={onAddScenarioStep}
        onRemove={onRemoveScenarioStep}
      />
    </Section>
  )
}