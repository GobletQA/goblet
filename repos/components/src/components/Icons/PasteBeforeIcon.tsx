import { Icon, TIconProps } from './Icon'
import { forwardRef } from 'react'



export const PasteBeforeIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M8,11H11V21H13V11H16L12,7L8,11M4,3V5H20V3H4Z'
      }
    />
  )
})

