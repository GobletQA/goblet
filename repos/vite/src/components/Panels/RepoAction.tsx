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
export type TRepoContent = {}
export type TDisconnectAction = ComponentProps<typeof CloudOffIcon>

export type TRepoMeta = {
  repo:TRepoState
}

export type TRepoEmpty = {
}

const style = {
  empty: {
    display: `flex`,
    marginTop: `5px`,
    paddingLeft: `5px`,
    paddingRight: `5px`,
    marginBottom: `0px`,
    alignContent: `center`,
    justifyContent: `center`,
  },
  git: {
    paddingRight: `5px`
  },
  container: {
    padding: `5px`,
    display: `flex`,
    marginTop: `5px`,
    paddingLeft: `10px`,
    marginBottom: `0px`,
    alignContent: `center`,
    flexDirection: `column`,
    justifyContent: `center`,
  },
  text: {
    fontSize: `14px`,
    lineHeight: `16px`,
    marginBottom: `2px`,
  }
}

const DisconnectAction = (props:TDisconnectAction) => {
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

export const RepoContent = (props:TRepoContent) => {
  const repo = useRepo()

  return !repo?.git
    ? (
        <Box sx={style.empty} >
          <Button onClick={onConnect}>
            <Git sx={style.git} />
            Connect Repository
          </Button>
        </Box>
      )
    : (
        <Box sx={style.container} >
          <Text
            noWrap
            sx={style.text}
            component='label'
          >
            <b>Name:</b>
            <a href={repo?.git?.remote} target='_blank' >
              {repo?.name}
            </a>
          </Text>
          <Text
            noWrap
            sx={style.text}
            component='label'
          >
            <b>Branch:</b>
            {repo?.git?.branch}
          </Text>
        </Box>
      )
}

export const RepoAction = {
  id:`connect-repo`,
  Component: DisconnectAction,
  className:`goblet-connect-repo`,
  action:(e:Event) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    disconnectRepo()
  },
}