import type { TRepoState } from '@types'
import type { TSidebarPanel } from '@gobletqa/monaco'
import type { ComponentProps } from 'react'

import { useRepo } from '@store'
import Box from '@mui/material/Box'
import { Text } from '@gobletqa/components'
import { asCallback } from '@utils/helpers'
import { Tooltip } from '@components/Tooltip'
import { Button } from '@components/Buttons/Button'
import { Git, CloudOffIcon } from '@components/Icons'
import { connectModal } from '@actions/modals/modals'
import { disconnectRepo } from '@actions/repo/api/disconnect'

const onConnect = asCallback(connectModal, false)

export type TConnectContent = {}
export type TDisconnectRepo = ComponentProps<typeof CloudOffIcon>

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
    marginBottom: `5px`,
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
    marginBottom: `5px`,
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


const RepoMeta = (props:TRepoMeta) => {
  const {
    repo,
  } = props
  
  const { name, git } = repo
  const { branch, remote } = git
  
  return (
    <Box sx={style.container} >
      <Text
        noWrap
        type='label'
        sx={style.text}
      >
        <b>Name:</b> <a href={remote} target='_blank' >{name}</a>
      </Text>
      <Text
        noWrap
        type='label'
        sx={style.text}
      >
        <b>Branch:</b> {branch}
      </Text>
    </Box>
  )
}

const RepoEmpty = (props:TRepoEmpty) => {
  return (
    <Box sx={style.empty} >
      <Button onClick={onConnect}>
        <Git sx={style.git} />
        Connect Repository
      </Button>
    </Box>
  )
}

export const ConnectContent = (props:TConnectContent) => {
  const repo = useRepo()

  return !repo || !repo?.git
    ? (<RepoEmpty />)
    : (<RepoMeta repo={repo} />)
}

const DisconnectRepo = (props:TDisconnectRepo) => {
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

export const ConnectPanel:TSidebarPanel = {
  actions: [
    {
      id:`connect-repo`,
      Component: DisconnectRepo,
      className:`goblet-connect-repo`,
      action:(e:Event) => {
        e?.stopPropagation?.()
        e?.preventDefault?.()
        disconnectRepo()
      },
    },
  ],
  header: true,
  startOpen: false,
  title: `Repository`,
  children:(<ConnectContent />),
  className:`goblet-editor-connect-panel`
}
