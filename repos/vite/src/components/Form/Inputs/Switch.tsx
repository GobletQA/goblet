import type { ComponentProps } from 'react'
import { SwitchElement } from 'react-hook-form-mui'

export type TSwitch = ComponentProps<typeof SwitchElement> & {
  
}

export const Switch = (props:TSwitch) => {
  const { ...rest } = props
  return (
    <SwitchElement {...rest} />
  )
}