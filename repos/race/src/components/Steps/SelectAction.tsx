import type { HTMLAttributes } from 'react'
import type { TAutoOpt } from '@gobletqa/components'
import type { TStepAst } from '@ltipton/parkin'
import type { TStepParentAst } from '@GBR/types'
import type { AutocompleteRenderOptionState } from '@mui/material/Autocomplete'

import { Tooltip, AutoInput } from '@gobletqa/components'
import { useOnStepAction }  from '@gobletqa/race/hooks/useOnStepAction'
import { useStepOptions } from '@gobletqa/race/hooks/useStepOptions'

import { sharedAutoInputStyles, sharedLabelProps } from '../Shared'
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
  ...sharedLabelProps,
  sx: sharedAutoInputStyles
}

const RenderOption = (
  props:HTMLAttributes<HTMLLIElement>,
  option: unknown,
  state: AutocompleteRenderOptionState
) => {
  const opt = option as TAutoOpt

  return (
    <Tooltip 
      arrow
      loc='right'
      title={opt.info}
      key={(props as Record<`key`, string>).key || opt.id}
    >
      <li {...props} >
        <div key={opt.id} >
          {opt.label}
        </div>
      </li>
    </Tooltip>
  )
}

export const SelectAction = (props:TSelectAction) => {

  const options = useStepOptions()
  const onChange = useOnStepAction(props)

  return (
    <StepGridItem xs={12} sm={3} >
      <AutoInput
        {...actSelectProps}
        options={options}
        onChange={onChange}
        autocompleteProps={{
          renderOption: RenderOption
        }}
        className='gr-step-action-select-dropdown'
      />
    </StepGridItem>
  )
  
}