import { forwardRef } from 'react'
import { Icon, TIconProps } from './Icon'

export const TimerSandIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M22 6V18H16L12 14L8 18H2V6H8L12 10L16 6M7.5 16L11.5 12L7.5 8H4V16M12.5 12L16.5 16H20V8H16.5M18 12V14H17.2L15.2 12M8.8 12L6.8 14H6V12Z'
      }
    />
  )
})