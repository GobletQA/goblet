import type { HTMLAttributes } from 'react'
import type { TStepDef } from '@ltipton/parkin'
import type { TAutoOpt } from '@gobletqa/components'
import type { TRaceStep, TRaceStepParent } from '@GBR/types'
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
  step: TRaceStep
  definition?:TStepDef
  parent:TRaceStepParent
  onChange:(step:TRaceStep) => void
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
      key={opt.id}
      title={opt.info}
    >
      <li {...props} >
        <div>
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