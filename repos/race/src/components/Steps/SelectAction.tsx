
import type { TStepParentAst, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'


import { useOnStepChange }  from '@GBR/hooks/useOnStepChange'
import { useStepOptions } from '@gobletqa/race/hooks/useStepOptions'
import { AutoInput } from '@gobletqa/components/components/Form/Inputs'


import {
  StepGridItem
} from './Steps.styled'

export type TSelectAction = {
  step: TStepAst
  parent:TStepParentAst
  onChange:(step:TStepAst) => void
}

const actSelectProps = {
  name: `step-action`,
  required: true,
  label: `Action`,
  textFieldProps: {
    placeholder: `Select an action`,
  },
}

export const SelectAction = (props:TSelectAction) => {

  const options = useStepOptions()
  const onChange = useOnStepChange(props)

  return (
    <StepGridItem xs={4} >
      <AutoInput
        {...actSelectProps}
        options={options}
        onChange={onChange}
        className='gr-step-action-select-dropdown'
      />
    </StepGridItem>
  )
  
}