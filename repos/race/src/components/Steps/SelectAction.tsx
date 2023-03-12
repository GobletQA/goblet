import type { HTMLAttributes } from 'react'
import type { TAutoOpt } from '@gobletqa/components'
import type { TStepParentAst } from '@GBR/types'
import type { TStepAst, TStepDef } from '@ltipton/parkin'
import type { AutocompleteRenderOptionState } from '@mui/material/Autocomplete'

import { Tooltip, AutoInput } from '@gobletqa/components'
import { useOnStepAction }  from '@gobletqa/race/hooks/useOnStepAction'
import { useStepOptions } from '@gobletqa/race/hooks/useStepOptions'

import { sharedAutoInputStyles, sharedLabelProps } from '../Shared'
import {
  StepGridItem,
  ActionInfoText
} from './Steps.styled'

export type TSelectAction = {
  step: TStepAst
  definition?:TStepDef
  parent:TStepParentAst
  onChange:(step:TStepAst) => void
}

export type TActionInfo = {
  definition?:TStepDef
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

const ActionInfo = (props:TActionInfo) => {
  const { definition } = props

  return (
    <Tooltip 
      loc='bottom'
      describeChild
      enterDelay={500}
      title={definition?.meta?.info}
    >
      <ActionInfoText>
        {definition?.meta?.info}
      </ActionInfoText>
    </Tooltip>
  )
}

const autocompleteProps = { renderOption: RenderOption }

export const SelectAction = (props:TSelectAction) => {
  const { options, active } = useStepOptions(props)
  const onChange = useOnStepAction(props)

  return (
    <StepGridItem xs={12} sm >
      <AutoInput
        {...actSelectProps}
        value={active}
        options={options}
        onChange={onChange}
        autocompleteProps={autocompleteProps}
        className='gb-step-action-select-dropdown'
        helperText={<ActionInfo definition={props?.definition} />}
      />
    </StepGridItem>
  )
  
}