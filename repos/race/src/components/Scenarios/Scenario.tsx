import { TScenarioAst } from '@GBR/types'
import { TSectionType } from '../../types'

import { Section } from '../Section'
import { Steps } from '../Steps'


export type TScenario = {
  scenario:TScenarioAst
} 

export const Scenario = (props:TScenario) => {
  const { scenario } = props

  return (
    <Section
      type={TSectionType.scenario}
      title={scenario?.scenario}
    >
      <Steps scenario={scenario} />
    </Section>
  )
}