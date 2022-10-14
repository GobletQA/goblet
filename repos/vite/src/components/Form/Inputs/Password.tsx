import type { ComponentProps } from 'react'
import { PasswordElement } from 'react-hook-form-mui'

export type TPassword = ComponentProps<typeof PasswordElement> & {
  
}

export const Password = (props:TPassword) => {
  const { ...rest } = props
  return (
    <PasswordElement {...rest} />
  )
}