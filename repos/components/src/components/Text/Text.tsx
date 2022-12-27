import type { ComponentProps } from 'react'
import Typography from '@mui/material/Typography'

export type TText = ComponentProps<typeof Typography> & {
  type?:string
  element?:string
  component?:string
}

export const Text = (props:TText) => {
  const {
    type,
    element=type,
    component=element,
    ...rest
  } = props

  return (
    <Typography
      {...rest}
      // @ts-ignore - There's a bug with mui. This is a valid prop but TS doesn't agree
      component={component}
    />
  )
}