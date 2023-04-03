import type { TRaceStep } from '@GBR/types'

import { StepHeaderText } from './Steps.styled'
import { capitalize, cls } from '@keg-hub/jsutils'
import { SectionHeaderType, SectionHeaderContent } from '../Section/SectionHeader.styled'

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
                    `gb-step-header-text-type`,
                    `gb-section-header-text-type`,
                    step.type && `gb-section-header-text-${step.type}`
                  )}
                >
                  {capitalize(step.type)}
                </SectionHeaderType>
                <SectionHeaderContent
                  className={cls(
                    `gb-step-header-text-content`,
                    `gb-section-header-text-content`,
                    step.type && `gb-section-header-text-content-${step.type}`
                  )}
                >
                  {step.step}
                </SectionHeaderContent>
              </>
            )
          : (
              <SectionHeaderType
                  className={cls(
                    `gb-step-header-text-type`,
                    `gb-section-header-text-empty`
                  )}
              >
                Empty Step
              </SectionHeaderType>
            )
      }
      
    </StepHeaderText>
  )
}