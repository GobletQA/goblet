import type { ComponentProps } from 'react'
import { Input } from '@gobletqa/components'
import type { TExpPart, TStepParentAst, TStepAst } from '@GBR/types'


export type TExpInput = ComponentProps<typeof Input> & {
  step: TStepAst
  expression:TExpPart
  parent:TStepParentAst
  disabled:boolean
  value:string|number
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
      {...rest}
      defaultValue={value || ``}
    />
  )
}