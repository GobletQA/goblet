import type { TSidebarPanel } from '@gobletqa/components'

import { useRepo } from '@store'
import { LockAction } from './LockAction'
import { PanelHeaderText } from '@gobletqa/components'
import { UnmountAction } from './UnmountAction'


const ActionsPanelTitle = () => {
  const repo = useRepo()
  
  return (
    <PanelHeaderText>
      {repo?.name || `unknown`}
    </PanelHeaderText>
  )
  
}


export const ActionsPanel:TSidebarPanel = {
  actions: [
    UnmountAction,
    LockAction
  ],
  header: true,
  startOpen: false,
  headerHover:false,
  title: ActionsPanelTitle,
  className:`goblet-editor-connect-panel`
}
