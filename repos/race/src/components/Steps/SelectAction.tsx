import type { CSSProperties } from 'react'
import type { TStepParentAst, TStepAst } from '@GBR/types'
import type { TAutoOpt } from '@gobletqa/components'
import type { HTMLAttributes } from 'react'
import type { AutocompleteRenderOptionState } from '@mui/material/Autocomplete'

import { AutoInput } from '@gobletqa/components'
import { useOnStepChange }  from '@GBR/hooks/useOnStepChange'
import { useStepOptions } from '@gobletqa/race/hooks/useStepOptions'


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
  labelSx: {
    fontSize: `12px`,
  },
  labelWrapSx: {
    // marginBottom: `5px !important`
  },
  sx: {
    [`&.gc-auto-input`]: {
      [`& .MuiInputBase-root`]: {
        height: `35px`,

        [`& input`]: {
          height: `35px`,
          fontSize: `12px`,
        },
        [`& input::placeholder`]: {
          fontSize: `12px`
        }
      }
    }
  } as CSSProperties
}

const RenderOption = (
  props:HTMLAttributes<HTMLLIElement>,
  option: unknown,
  state: AutocompleteRenderOptionState
) => {
  const opt = option as TAutoOpt

  return (
    <li {...props} >
      <div key={opt.id} >
        {opt.label}
      </div>
    </li>
  )
}

export const SelectAction = (props:TSelectAction) => {

  const options = useStepOptions()
  const onChange = useOnStepChange(props)

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