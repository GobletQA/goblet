import type { TRepoState } from '@types'
import type { TSidebarPanel } from '@gobletqa/monaco'

import { useRepo } from '@store'
import Box from '@mui/material/Box'
import { noOp } from '@keg-hub/jsutils'
import { Text } from '@components/Text'
import { Git, CloudOffIcon } from '@components/Icons'
import { Button } from '@components/Buttons/Button'

export type TConnectContent = {}

export type TRepoMeta = {
  repo:TRepoState
}


export type TRepoEmpty = {
}


const RepoMeta = (props:TRepoMeta) => {
  const {
    repo,
  } = props
  
  const { name, git } = repo
  const { branch, remote } = git
  
  return (
    <Box
      sx={{
        display: `flex`,
        marginTop: `5px`,
        paddingLeft: `5px`,
        marginBottom: `5px`,
        flexDirection: `column`,
        alignContent: `center`,
        justifyContent: `center`,
      }}
    >
      <Text
        noWrap
        type='label'
        sx={{
          fontSize: `12px`,
        }}
      >
        <b>Name:</b> <a href={remote}>{name}</a>
      </Text>
      <Text
        noWrap
        type='label'
        sx={{
          fontSize: `12px`,
        }}
      >
        <b>Branch:</b> {branch}
      </Text>
    </Box>
  )
}

const RepoEmpty = (props:TRepoEmpty) => {
  return (
    <Box
      sx={{
        marginTop: `5px`,
        paddingLeft: `5px`,
        paddingRight: `5px`,
        marginBottom: `5px`,
        display: `flex`,
        alignContent: `center`,
        justifyContent: `center`,
      }}
    >
      <Button>
        <Git sx={{ paddingRight: `5px` }} />
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

export const ConnectPanel:TSidebarPanel = {
  actions: [
    {
      action:noOp,
      id:`connect-repo`,
      Component: CloudOffIcon,
      className:`goblet-connect-repo`,
    },
  ],
  header: true,
  startOpen: true,
  title: `Repository`,
  children:(<ConnectContent />),
  className:`goblet-monaco-connect-panel`
}
