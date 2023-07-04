import { Icon, TIconProps } from './Icon'
import { forwardRef } from 'react'

export const PasteAfterIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M16,13H13V3H11V13H8L12,17L16,13M4,19V21H20V19H4Z'
      }
    />
  )
})

