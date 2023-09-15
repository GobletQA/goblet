import type { TGitData, TRepoOpts } from '@types'
import type { TSidebarPanel } from '@gobletqa/components'

import { useMemo } from 'react'
import { useRepo } from '@store'
import { LockAction } from './LockAction'
import { styled } from '@mui/material/styles'
import { UnmountAction } from './UnmountAction'
import { ExamRunAction } from './ExamRunAction'
import { wordCaps, emptyObj } from '@keg-hub/jsutils'
import { dims, gutter, colors, Span, Tooltip } from '@gobletqa/components'

export const TTT = styled(Span)`
  display: block;
  line-height: 22px;
  &.repo {
    font-size: 16px;
    margin-bottom: ${gutter.margin.hpx};
    * {
      font-size: 16px;
    }
  }
`

export const TTV = styled(Span)`
  margin-left: ${gutter.margin.qpx};
`

export const PanelHeaderText = styled(Span)`
  flex: 1;
  font-size: 15px;
  cursor: initial;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: initial;
  text-overflow: ellipsis;
  color: ${colors.purple10};
  padding-left: ${gutter.padding.qpx};
  padding-right: ${gutter.padding.qpx};
`

const TooltipStyles = {
  maxWidth: `none`,
}

const useGitData = (repo:TRepoOpts) => {
  return useMemo(() => {
    const { git=emptyObj as TGitData } = repo
    const { repoName, branch, provider, remote } = git
    const name = wordCaps(repoName || repo?.name || `unknown`)
    return {
      name,
      branch,
      remote,
      provider,
    }
  }, [
    repo?.name,
    repo?.git,
  ])
}

const RepoToolTip = (props:{ repo:TRepoOpts }) => {
  const {
    name,
    branch,
    remote,
    provider,
  } = useGitData(props.repo)

  return (
    <>
      {name && (
        <TTT className='repo' key='repo'>
          Repo:
          <TTV>{name}</TTV>
        </TTT>
      ) || null}
      {branch && (
        <TTT className='branch' key='branch'>
          Branch:
          <TTV>{branch}</TTV>
        </TTT>
      ) || null}
      {provider && (
        <TTT className='provider' key='provider'>
          Provider:
          <TTV>{provider}</TTV>
        </TTT>
      ) || null}
      {remote && (
        <TTT className='remote' key='remote'>
          Remote URL:
          <TTV>{remote}</TTV>
        </TTT>
      ) || null}
    </>
  )
  
}

const ActionsPanelTitle = () => {
  const repo = useRepo()
  const name = wordCaps(repo?.git?.repoName || repo?.name || `unknown`)

  return (
    <Tooltip
      sx={TooltipStyles}
      loc='bottom'
      describeChild
      enterDelay={500}
      fontSize={`14px`}
      title={<RepoToolTip repo={repo} />}
    >
      <PanelHeaderText className='gb-panel-repo-header-text' >
        {name}
      </PanelHeaderText>
    </Tooltip>
  )
}


export const ActionsPanel:TSidebarPanel = {
  actions: [
    ExamRunAction,
    UnmountAction,
    LockAction,
  ],
  sx: {
    borderBottom: `1px solid var(--goblet-sideBarSectionHeader-border)`,
  },
  header: true,
  startOpen: false,
  headerHover:false,
  title: ActionsPanelTitle,
  className:`gb-editor-connect-panel`,
  headerClassName: `gb-panel-connect-root-header`,
  headerSx: {
    height: dims.dropdown.header.px,
  },
}
