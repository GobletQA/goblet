import { TScenarioAst } from '@GBR/types'

import { Steps } from '../Steps'
import { Section, SectionHeader } from '../Section'
import { EEditKey, ESectionType } from '@GBR/types'

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
        underline={true}
        title={scenario?.scenario}
        editKey={EEditKey.scenario}
        type={ESectionType.scenario}
      />
      <Steps parent={scenario} />
    </Section>
  )
}