
import { Icon, TIconProps } from './Icon'
import { forwardRef } from 'react'

export const PlayOutlineIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M8.5,8.64L13.77,12L8.5,15.36V8.64M6.5,5V19L17.5,12'
      }
    />
  )
})