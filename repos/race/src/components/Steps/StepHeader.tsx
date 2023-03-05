import type { TStepAst } from '@ltipton/parkin'

import { capitalize } from '@keg-hub/jsutils'
import { StepHeaderText } from './Steps.styled'

export type TStepHeader = {
  step: TStepAst
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