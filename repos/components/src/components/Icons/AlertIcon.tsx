import { forwardRef } from 'react'
import { Icon, TIconProps } from './Icon'

export const AlertIcon = forwardRef((props:TIconProps, ref) => {
  return (
    <Icon
      {...props}
      ref={ref}
      viewBox="0 0 24 24"
      delta={
        'M12,2L1,21H23M12,6L19.53,19H4.47M11,10V14H13V10M11,16V18H13V16'
      }
    />
  )
})

