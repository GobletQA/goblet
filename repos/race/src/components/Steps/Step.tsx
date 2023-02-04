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
import { useInline } from '@gobletqa/components'
import { copyStep } from '@GBR/actions/step/copyStep'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
  onRemove?:(stepId:string, parentId?:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
}



export const Step = (props:TStep) => {
  const { onChange, onRemove, step, parent } = props
  const onStepChange = useInline((updated:TStepAst) => onChange?.(updated, step))

  return (
    <StepContainer
      variant="outlined"
    >
      <StepContent>
        <StepGrid
          container
          spacing={1}
          width='100%'
          disableEqualOverflow
        >
          <SelectAction
            step={step}
            parent={parent}
            onChange={onStepChange}
          />
          <SelectSubject
            step={step}
            parent={parent}
            onChange={onStepChange}
          />
          <Modifier
            step={step}
            parent={parent}
            onStepChange={onStepChange}
          />
          <StepActions step={step} parent={parent} />
        </StepGrid>
      </StepContent>
    </StepContainer>
  )
}