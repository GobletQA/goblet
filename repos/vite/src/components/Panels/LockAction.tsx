import type { MouseEventHandler, ComponentProps } from 'react'
import { getStore, useApp } from '@store'
import { SettingSidebarLocked } from '@constants/settings'
import { updateSettingValue } from '@actions/settings/updateSettingValue'
import {
  colors,
  Tooltip,
  LockIcon,
  stopEvent,
  IconButton,
  LockOpenIcon,
} from '@gobletqa/components'

type TIcon = typeof LockIcon | typeof LockOpenIcon
export type TLockIcon = ComponentProps<TIcon>

const styles = {
  lock: {
    open: { color: colors.green10, fontSize: `16px` },
    closed: { color: colors.red10, fontSize: `16px` }
  },
  button: {
    padding: `0px`,
    marginRight: `0px`,
    pointerEvents: `auto`,
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
  action:(evt:Event) => {
    stopEvent(evt)
    const { app } = getStore().getState()
    const { sidebarLocked } = app

    updateSettingValue({
      value: !sidebarLocked,
      setting: SettingSidebarLocked
    })
  },
}