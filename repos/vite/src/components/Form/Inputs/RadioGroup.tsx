import type { ComponentProps } from 'react'
import { RadioButtonGroup } from 'react-hook-form-mui'

export type TRadioGroup = ComponentProps<typeof RadioButtonGroup> & {
  
}

export const RadioGroup = (props:TRadioGroup) => {
  const { ...rest } = props
  return (
    <RadioButtonGroup {...rest} />
  )
}