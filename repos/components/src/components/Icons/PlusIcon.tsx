

import { forwardRef } from 'react'
import { Icon, TIconProps } from './Icon'



export const PlusIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z'
      }
    />
  )
})
