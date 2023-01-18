import type { TRepoState } from '@types'
import type { ComponentProps } from 'react'

import { useRepo } from '@store'
import Box from '@mui/material/Box'
import { asCallback } from '@utils/helpers'
import { connectModal } from '@actions/modals/modals'
import { disconnectRepo } from '@actions/repo/api/disconnect'
import {
  Git,
  Text,
  Button,
  Tooltip,
  CloudOffIcon,
} from '@gobletqa/components'

const onConnect = asCallback(connectModal, false)
export type TUnmountContent = {}
export type TUnmountBtn = ComponentProps<typeof CloudOffIcon>



const UnmountBtn = (props:TUnmountBtn) => {
  return (
    <Tooltip
      loc='bottom'
      describeChild
      title={`Unmount repository`}
      enterDelay={500}
      fontSize={`10px`}
    >
      <CloudOffIcon {...props} />
    </Tooltip>
  )
}

export const UnmountAction = {
  id:`connect-repo`,
  Component: UnmountBtn,
  className:`goblet-connect-repo`,
  action:(e:Event) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    disconnectRepo()
  },
}
