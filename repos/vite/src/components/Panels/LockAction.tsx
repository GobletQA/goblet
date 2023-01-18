import type { MouseEventHandler, ComponentProps } from 'react'
import {
  colors,
  Tooltip,
  LockIcon,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'
import { useApp } from '@store'
import { toggleSidebarLocked } from '@actions/nav/toggleSidebarLocked'

type TIcon = typeof LockIcon | typeof LockOpenIcon
export type TLockIcon = ComponentProps<TIcon>

const styles = {
  lock: {
    open: { color: colors.green10, fontSize: `16px` },
    closed: { color: colors.red10, fontSize: `16px` }
  },
  button: {
    pointerEvents: `auto`
  }
}

const LockActionComp = (props:TLockIcon) => {
  const { sidebarLocked } = useApp()

  const sx = sidebarLocked
    ? { color: colors.red10 }
    : { color: colors.green10 }

  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`10px`}
      title={`Lock the Sidebar open`}
    >
      <IconButton
        sx={styles.button}
        onClick={props?.onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
      {
        sidebarLocked
          ? <LockIcon sx={styles.lock.closed} />
          : <LockOpenIcon sx={styles.lock.open} />
      }
      </IconButton>
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
    toggleSidebarLocked()
  },
}