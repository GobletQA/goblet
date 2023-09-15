import type { ComponentProps, MouseEventHandler } from 'react'

import { asCallback } from '@utils/helpers'
import { connectModal } from '@actions/modals/modals'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import {
  gutter,
  Tooltip,
  IconButton,
  CloudOffIcon,
} from '@gobletqa/components'

const onConnect = asCallback(connectModal, false)
export type TUnmountContent = {}
export type TUnmountBtn = ComponentProps<typeof CloudOffIcon>

const styles = {
  icon: {
    fontSize: `16px`
  },
  button: {
    padding: `0px`,
    marginRight: `0px`,
    pointerEvents: `auto`,
  }
}

const UnmountBtn = (props:TUnmountBtn) => {
  const { onClick, ...rest } = props
  
  return (
    <Tooltip
      loc='bottom'
      describeChild
      enterDelay={500}
      title={`Unmount repository`}
    >
      <IconButton
        sx={styles.button}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>|undefined}
      >
        <CloudOffIcon {...rest} sx={styles.icon} />
      </IconButton>
    
    </Tooltip>
  )
}

export const UnmountAction = {
  id:`connect-repo`,
  Component: UnmountBtn,
  className:`goblet-connect-repo`,
  action:(e:Event) => {
    // TODO: Add confirmation model here
    
    e?.stopPropagation?.()
    e?.preventDefault?.()
    disconnectRepo()
  },
}
