import { TScenarioAst } from '@GBR/types'
import { ESectionType } from '../../types'

import { Steps } from '../Steps'
import { capitalize } from '@keg-hub/jsutils'
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
        underline={true}
        type={ESectionType.scenario}
        title={scenario?.scenario.trim() ||capitalize(ESectionType.scenario)}
      />
      <Steps parent={scenario} />
    </Section>
  )
}