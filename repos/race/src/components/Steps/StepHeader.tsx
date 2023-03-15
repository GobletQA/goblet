import type { TRaceStep } from '@GBR/types'

import { capitalize } from '@keg-hub/jsutils'
import { StepHeaderText } from './Steps.styled'

export type TStepHeader = {
  step: TRaceStep
}

export const StepHeader = (props:TStepHeader) => {
  const {
    step,
  } = props

  return (
    <StepHeaderText>
      {
        step.step
          ? (<span><b>{capitalize(step.type)}</b> {step.step}</span>)
          : (<b>Step</b>)
      }
      
    </StepHeaderText>
  )
}