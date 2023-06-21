import type { TSidebarPanel } from '@gobletqa/components'

import { useRepo } from '@store'
import { wordCaps } from '@keg-hub/jsutils'
import { LockAction } from './LockAction'
import { styled } from '@mui/material/styles'
import { UnmountAction } from './UnmountAction'
import { dims, gutter, colors, Span, Tooltip } from '@gobletqa/components'


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

const ActionsPanelTitle = () => {
  const repo = useRepo()
  const name = wordCaps(repo?.name || `unknown`)
  return (
    <Tooltip
      loc='bottom'
      title={name}
      describeChild
      enterDelay={500}
    >
      <PanelHeaderText className='gb-panel-repo-header-text' >
        {name}
      </PanelHeaderText>
    </Tooltip>
  )
}


export const ActionsPanel:TSidebarPanel = {
  actions: [
    UnmountAction,
    LockAction
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
