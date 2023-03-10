import type { ReactNode, ForwardedRef, ComponentProps } from 'react'
import { forwardRef } from 'react'
import Typography from '@mui/material/Typography'

export type TTextRef = ForwardedRef<typeof Typography>

export type TText = ComponentProps<typeof Typography> & {
  component?:ReactNode
  textRef?:ForwardedRef<any>
}

export const Text = forwardRef((props:TText, ref:ForwardedRef<any>) => {
  const { component, ...rest } = props

  return (
    <Typography
      {...rest}
      ref={ref}
      // @ts-ignore - There's a bug with mui. This is a valid prop but TS doesn't agree
      component={component}
    />
  )
})
