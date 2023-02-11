import type { ReactNode, ComponentType, ComponentProps } from 'react'

import { ESectionType, TRaceFeature } from '@GBR/types'

import {
  Span,
  colors,
  StepAddIcon,
} from '@gobletqa/components'

const GreenText = (props:ComponentProps<typeof Span>) => (
  <Span
    {...props}
    sx={{
      fontWeight: `bold`,
      color: colors.green10
    }}
  />
)

export const StepItem = {
  text: `Add Step`,
  Icon: StepAddIcon,
  featureKey: `steps`,
  type: ESectionType.step,
  description: (
    <Span>
      <b>Step</b> - a condition to be set, or an action to be performed in order to achieve the desired outcome of a Scenario. Steps are the building blocks of a Scenario and provide a clear, concise description of the behavior being tested.
      <br/>
      <br/>
      A Step starts with a keyword <GreenText>Given</GreenText>, <GreenText>When</GreenText>, or <GreenText>Then</GreenText> and is followed by a natural language description of the action or condition.
    </Span>
  )
}