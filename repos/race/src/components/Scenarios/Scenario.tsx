import type { MouseEvent } from 'react'
import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useEditor } from '../../contexts'
import { Delete } from '../Actions/Delete'
import { stopEvent, useInline } from '@gobletqa/components'


export type TScenario = {
  scenario: TScenarioAst
  parent: TScenarioParentAst
  onAdd?: (...args:any[]) => void
  onRemove: (scenarioId:string, parentId?:string) => void
  onAddStep: (scenarioId:string, parentId?:string) => void
}

export const Scenario = (props:TScenario) => {
  const { onAddStep, onRemove, scenario, parent } = props

  const onTrash = useInline((evt:MouseEvent) => {
    stopEvent(evt)
    onRemove(scenario.uuid, parent.uuid)
  })

  const onAddScenarioStep = useInline(() => {
    onAddStep(scenario.uuid, parent.uuid)
  })

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
        Delete({
          onClick: onTrash,
          type: ESectionType.background,
        })
      ]}
    >
      <Steps parent={scenario} onAdd={onAddScenarioStep} />
    </Section>
  )
}