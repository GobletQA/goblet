import { forwardRef } from 'react'
import { Icon, TIconProps } from './Icon'


export const PlayPauseIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M3,5V19L11,12M13,19H16V5H13M18,5V19H21V5'
      }
    />
  )
})
