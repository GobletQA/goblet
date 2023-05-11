import type { TSidebarPanel } from '@gobletqa/components'

import { useRepo } from '@store'
import { wordCaps } from '@keg-hub/jsutils'
import { LockAction } from './LockAction'
import { styled } from '@mui/material/styles'
import { UnmountAction } from './UnmountAction'
import { dims, gutter, colors, Span } from '@gobletqa/components'

export const PanelHeaderText = styled(Span)`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: ${colors.purple10};
  padding-left: ${gutter.padding.qpx};
`

const ActionsPanelTitle = () => {
  const repo = useRepo()
  return (
    <PanelHeaderText className='gb-panel-repo-header-text' >
      {wordCaps(repo?.name || `unknown`)}
    </PanelHeaderText>
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
