import { TScenarioAst } from '@GBR/types'

import { Stack } from '../Shared'
import { Steps } from '../Steps'
import { ESectionType } from '@GBR/types'


export type TScenario = {
  scenario:TScenarioAst
} 

export const Scenario = (props:TScenario) => {
  const { scenario } = props

  return (
    <Stack
      stack={1}
      type={ESectionType.scenario}
    >
      <Steps parent={scenario} />
    </Stack>
  )
}