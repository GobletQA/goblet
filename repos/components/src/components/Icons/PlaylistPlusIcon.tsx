import { Icon, TIconProps } from './Icon'
import { forwardRef } from 'react'

export const PlaylistPlusIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z'
      }
    />
  )
})