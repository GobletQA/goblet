
import type { TStepParentAst, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { useOnStepChange }  from '@GBR/hooks/useOnStepChange'
import { useStepSubjects } from '@gobletqa/race/hooks/useStepSubjects'
import { AutoInput } from '@gobletqa/components/components/Form/Inputs'

import {
  StepGridItem
} from './Steps.styled'

export type TSelectSubject = {
  step: TStepAst
  parent:TStepParentAst
  onChange:(step:TStepAst) => void
}

const actSelectProps = {
  name: `step-subject`,
  required: true,
  label: `Subject`,
  textFieldProps: {
    placeholder: `Select a subject`,
  },
}

export const SelectSubject = (props:TSelectSubject) => {
  const { step } = props

  const options = useStepSubjects(props)
  const onChange = useOnStepChange(props)

  return (
    <StepGridItem xs={4} >
      <AutoInput
        {...actSelectProps}
        options={options}
        onChange={onChange}
        className='gr-step-subject-select-dropdown'
        disabled={!Boolean(step.definition) || Boolean(!options.length)}
      />
    </StepGridItem>
  )
  
}