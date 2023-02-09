import { Icon, TIconProps } from './Icon'
import { forwardRef } from 'react'

export const SquareIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M18,18H6V6H18V18Z'
      }
    />
  )
})