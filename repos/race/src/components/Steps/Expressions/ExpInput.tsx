import type { ComponentProps } from 'react'
import { Input } from '@gobletqa/components/components/Form/Inputs'


export type TExpInput = ComponentProps<typeof Input> & {
  disabled:boolean
  value:string|number
}

export const ExpInput = (props:TExpInput) => {
  const {
    value,
    ...rest
  } = props

  return (<Input {...rest} defaultValue={value || ``} />)
}