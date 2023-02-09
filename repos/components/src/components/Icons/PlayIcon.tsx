import { forwardRef } from 'react'
import { Icon, TIconProps } from './Icon'


export const PlayIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M8,5.14V19.14L19,12.14L8,5.14Z'
      }
    />
  )
})
