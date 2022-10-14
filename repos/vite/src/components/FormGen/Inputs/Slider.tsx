import type { ComponentProps } from 'react'
import MuiSlider from '@mui/material/Slider'

export type TSlider = ComponentProps<typeof MuiSlider> & {
  
}

export const Slider = (props:TSlider) => {
  return (<MuiSlider {...props} />)
}
