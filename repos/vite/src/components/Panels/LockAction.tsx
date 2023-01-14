import type { ComponentProps } from 'react'
import {
  Tooltip,
  LockIcon,
  LockOpenIcon,
} from '@gobletqa/components'


type TIcon = typeof LockIcon | typeof LockOpenIcon
export type TLockIcon = ComponentProps<TIcon>


const LockActionComp = (props:TLockIcon) => {
  console.log(`------- props -------`)
  console.log(props)
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Lock the Sidebar open`}
    >
      <LockIcon {...props} />
    </Tooltip>
  )
}


export const LockAction = {
  id:`lock-sidebar`,
  Component: LockActionComp,
  className:`goblet-lock-sidebar`,
  action:(e:Event) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    console.log(`------- lock sidebar -------`)
  },
}