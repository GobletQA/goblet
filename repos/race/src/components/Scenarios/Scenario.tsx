import type { TScenarioParentAst, TScenarioAst } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { useEditor } from '../../contexts'
import { useInline } from '@gobletqa/components'
import { addScenarioStep } from '@GBR/actions/scenario/addScenarioStep'

export type TScenario = {
  scenario: TScenarioAst
  parent: TScenarioParentAst
}

export const Scenario = (props:TScenario) => {
  const { scenario, parent } = props
  const { feature } = useEditor()

  const onAddScenario = useInline(() => {})

  return (
    <Section
      parent={parent}
      onAdd={onAddScenario}
      initialExpand={false}
      show={Boolean(scenario)}
      type={ESectionType.scenario}
      id={`${feature.uuid}-scenario`}
      className='gr-scenario-section'
    >
      <Steps parent={scenario} onAdd={addScenarioStep} />
    </Section>
  )
}