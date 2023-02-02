import type { TStepParentAst, TStepAst } from '@GBR/types'

import { Section } from '../Section'
import { ESectionType } from '@GBR/types'

import {
  StepGrid,
  StepContent,
  StepContainer,
} from './Steps.styled'

import { Modifier } from './Modifier'
import { StepActions } from './StepActions'
import { SelectAction } from './SelectAction'
import { SelectSubject } from './SelectSubject'
import { copyStep } from '@GBR/actions/step/copyStep'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
  onRemove?:(stepId:string, parentId?:string) => void
}

export const Step = (props:TStep) => {
  const { onRemove, step, parent } = props


  return (
    <StepContainer
      variant="outlined"
    >
      <StepContent>
        <StepGrid
          container
          spacing={1}
          disableEqualOverflow
        >
          <SelectAction step={step} />
          <SelectSubject step={step} />
          <Modifier step={step} />
          <StepActions step={step} parent={parent} />
        </StepGrid>
      </StepContent>
    </StepContainer>
  )
}