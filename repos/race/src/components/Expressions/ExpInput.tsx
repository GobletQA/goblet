import type { ComponentProps } from 'react'
import { Input } from '@gobletqa/components'
import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'
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
    expression,
    value,
    ...rest
  } = props

  return (
    <Input
      {...inputProps}
      {...rest}
      defaultValue={value || ``}
    />
  )
}