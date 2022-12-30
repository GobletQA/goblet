import type { ReactNode, ComponentProps } from 'react'

import Typography from '@mui/material/Typography'

export type TText = ComponentProps<typeof Typography> & {
  component?:ReactNode
}

export const Text = (props:TText) => {
  const { component, ...rest } = props

  return (
    <Typography
      {...rest}
      // @ts-ignore - There's a bug with mui. This is a valid prop but TS doesn't agree
      component={component}
    />
  )
}