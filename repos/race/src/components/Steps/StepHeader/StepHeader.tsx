import type { TExpPart, TRaceStep } from '@GBR/types'

import { capitalize } from '@keg-hub/jsutils'
import { StepHeaderSplit } from './StepHeaderSplit'
import { StepHeaderText } from './StepHeader.styled'
import { DecoText } from '@GBR/components/Deco/DecoText'
import { ESplitType, StepHeaderChunk } from './StepHeaderChunk'

export type TStepHeader = {
  step: TRaceStep
  missingDef?:boolean
  expressions?:TExpPart[]
}

export const StepHeader = (props:TStepHeader) => {
  const { step, missingDef } = props
  const hasStep = Boolean(step?.step?.trim())

  return (
    <DecoText id={step.uuid} >
      <StepHeaderText className='gb-step-header-text' >
        {
          hasStep
            ? (
                <StepHeaderChunk
                  type={step.type}
                  part={ESplitType.type}
                  missingDef={missingDef}
                  children={capitalize(step.type)}
                />
              )
            : (
                <StepHeaderChunk
                  type={step.type}
                  part={ESplitType.empty}
                  children={`Empty Step`}
                />
              )
        }
        {hasStep && (<StepHeaderSplit {...props} />) || null}
      </StepHeaderText>
    </DecoText>
  )
}