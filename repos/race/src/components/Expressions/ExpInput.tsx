import type { ComponentProps } from 'react'
import type { TStepAst } from '@ltipton/parkin'
import type { TExpPart, TStepParentAst } from '@GBR/types'

import { exists } from '@keg-hub/jsutils'
import { Input } from '@gobletqa/components'
import { sharedInputStyles, sharedLabelProps } from '../Shared'

export type TExpInput = ComponentProps<typeof Input> & {
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
  disabled:boolean
  value:string|number
}

const inputProps = {
  ...sharedLabelProps,
  inputSx: sharedInputStyles
}

export const ExpInput = (props:TExpInput) => {
  const {
    step,
    parent,
    value,
    expression,
    defaultValue,
    ...rest
  } = props

  return (
    <Input
      {...inputProps}
      {...rest}
      value={!exists(value) && !exists(defaultValue) ? `` : value}
    />
  )
}