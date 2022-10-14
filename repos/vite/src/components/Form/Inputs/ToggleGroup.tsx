import type { ComponentProps } from 'react'
import { ToggleButtonGroupElement } from 'react-hook-form-mui'

export type TButtonGroup = ComponentProps<typeof ToggleButtonGroupElement> & {
  
}

export const ButtonGroup = (props:TButtonGroup) => {
  const { ...rest } = props
  return (
    <ToggleButtonGroupElement {...rest} />
  )
}

