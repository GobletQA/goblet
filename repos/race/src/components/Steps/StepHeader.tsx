import type { TRaceStep } from '@GBR/types'

import { capitalize, cls } from '@keg-hub/jsutils'
import {
  StepHeaderText,
  SectionHeaderType,
  SectionHeaderContent
} from './Steps.styled'

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
          ? (
            
              <>
                <SectionHeaderType
                  className={cls(
                    `step-header-text-type`,
                    step.type && `section-header-text-${step.type}`
                  )}
                >
                  {capitalize(step.type)}
                </SectionHeaderType>
                <SectionHeaderContent
                  className={cls(
                    `step-header-text-content`,
                    step.type && `section-header-text-content-${step.type}`
                  )}
                >
                  {step.step}
                </SectionHeaderContent>
              </>
            )
          : (
              <SectionHeaderType
                  className={cls(
                    'step-header-text-type',
                    `section-header-text-empty`
                  )}
              >
                Empty Step
              </SectionHeaderType>
            )
      }
      
    </StepHeaderText>
  )
}