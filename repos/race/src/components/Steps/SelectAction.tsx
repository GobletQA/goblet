
import type { TStep, TStepParentAst, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'

import { ESectionType } from '@GBR/types'
import { useInline } from '@gobletqa/components'
import { useSteps }  from '@GBR/contexts/StepsContext'
import { AutoInput } from '@gobletqa/components/components/Form/Inputs'
import { useStepOptions } from '@gobletqa/race/hooks/useStepOptions'


import {
  StepGridItem
} from './Steps.styled'

export type TSelectAction = {
  step: TStepAst
  parent:TStepParentAst
  onStepChange:(step:TStepAst) => void
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

  const {
    step,
    onStepChange
  } = props

  const { steps } = useSteps()
  const options = useStepOptions()

  const onChange = useInline((evt:Event, opt:TAutoOpt) => {
    const found = steps[opt.id as keyof typeof steps]

    return !found
      ? console.error(`Can not find step`, opt, steps)
      : onStepChange?.({
          ...step,
          type: found.type,
          step: found.match,
          definition: found.uuid
        } as TStepAst)
  })

  return (
    <StepGridItem>
      <AutoInput
        {...actSelectProps}
        options={options}
        onChange={onChange}
        className='gr-step-action-select-dropdown'
      />
    </StepGridItem>
  )
  
}