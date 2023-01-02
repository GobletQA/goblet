import type { CSSProperties } from 'react'
import type { TIconButton } from './IconButton'

import { ModeEditIcon, CheckIcon } from '../Icons'
import { IconButton } from './IconButton'

import { InputActionsContainer, Button } from './Form.styled'

export type TInputAction = TIconButton & {
  action?: (...args:any[]) => void
}


export type TInputActions = {
  label?:string
  editing: boolean
  actions?:TInputAction[]
  onToggleEdit: (...args:any[]) => void
}

const styles:Record<string, CSSProperties> = {
  label: {},
  button: {},
  tooltip: {},
  container: {},
  icon: {fontSize: `14px`},
}

export const InputActions = (props:TInputActions) => {
  const {
    actions,
    editing,
    label=``,
    onToggleEdit
  } = props

  return (
    <InputActionsContainer className='gc-input-actions-container' >
      <>
        <IconButton
          active={editing}
          labelPos='bottom'
          OnIcon={CheckIcon}
          OffIcon={ModeEditIcon}
          onClick={onToggleEdit}
          sx={styles.button}
          iconSx={styles.icon}
          labelSx={styles.label}
          tooltipSx={styles.tooltip}
          containerSx={styles.container}
          tooltip={editing ? `Save ${label}` : `Edit ${label}`}
          className='gc-input-action-edit-toggle'
        />
        {actions?.length && actions.map(action => {
          const { action:onClick, ...rest } = action
          return (
            <IconButton
              active={editing}
              labelPos='bottom'
              onClick={onClick}
              sx={styles.button}
              iconSx={styles.icon}
              labelSx={styles.label}
              containerSx={styles.container}
              {...rest}
            />
          )
        }) || null}
      </>
    </InputActionsContainer>
  )
  
}