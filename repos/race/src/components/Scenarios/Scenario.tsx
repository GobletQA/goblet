import { TScenarioAst } from '@GBR/types'

import { Steps } from '../Steps'
import { ESectionType } from '@GBR/types'
import { Section, SectionHeader } from '../Section'

export type TScenario = {
  scenario:TScenarioAst
} 

export const Scenario = (props:TScenario) => {
  const { scenario } = props

  return (
    <Section
      stack={1}
      type={ESectionType.scenario}
    >
      <SectionHeader
        title={scenario?.scenario}
        type={ESectionType.scenario}
      />
      <Steps parent={scenario} />
    </Section>
  )
}