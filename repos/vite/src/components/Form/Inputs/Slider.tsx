import type { ComponentProps } from 'react'
import { SliderElement } from 'react-hook-form-mui'

export type TSlider = ComponentProps<typeof SliderElement> & {
  
}

export const Slider = (props:TSlider) => {
  const { ...rest } = props
  return (
    <SliderElement {...rest} />
  )
}