import type { ComponentProps, CSSProperties } from 'react'
import { TextFieldElement } from 'react-hook-form-mui'

export type TInput =  ComponentProps<typeof TextFieldElement> & {
  sx?: CSSProperties
}

export const Input = (props:TInput) => {
  const { sx, ...rest } = props
  
  return (
    <TextFieldElement sx={[{ width: `100%` }, sx]} {...rest} />
  )
}