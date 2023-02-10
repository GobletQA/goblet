import type { TStepParentAst, TStepAst } from '@GBR/types'

import { StepHeader } from './StepHeader'
import { StepActions } from './StepActions'
import { Expressions } from '../Expressions'
import { SelectAction } from './SelectAction'
import { useInline } from '@gobletqa/components'
import { NoExpMatch } from '../Expressions/NoExpMatch'
import { useExpressions } from '@GBR/hooks/useExpressions'
import {
  StepGrid,
  StepContent,
  StepContainer,
} from './Steps.styled'

export type TStep = {
  step: TStepAst
  parent: TStepParentAst
  onRemove?:(stepId:string, parentId?:string) => void
  onChange?:(updated:TStepAst, old?:TStepAst) => void
}


export const Step = (props:TStep) => {
  const { onChange, onRemove, step, parent } = props
  const { def, expressions } = useExpressions(props)

  const onCopy = useInline(() => {})
  const onStepChange = useInline((updated:TStepAst) => onChange?.(updated, step))
  const onRemoveStep = useInline(() => onRemove?.(step.uuid, parent.uuid))

  return (
    <StepContainer
      variant="outlined"
    >
      <StepHeader
        step={step}
        onCopy={onCopy}
        onRemove={onRemoveStep}
      />
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
          {def && (
            <Expressions
              def={def}
              step={step}
              parent={parent}
              onChange={onStepChange}
              expressions={expressions}
            />
          ) || step.step && (<NoExpMatch />)}

          <StepActions step={step} parent={parent} />
        </StepGrid>
      </StepContent>
    </StepContainer>
  )
}