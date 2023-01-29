import { useApp } from '@store'
import { RaceEditor } from '@gobletqa/race'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'
import { PrePanels } from '@components/Panels/PrePanels'
import { BlockIcon, DefSidebarWidth } from '@gobletqa/components'

export type TVisualEditor = {
  
}

export const VisualEditor = (props:TVisualEditor) => {
  const { sidebarLocked } = useApp()
  const {
    steps,
    features,
    connected,
    rootPrefix
  } = useRaceHooks()

  return connected
    ? (
        <RaceEditor
          steps={steps}
          actions={Actions}
          Divider={Divider}
          features={features}
          PrePanels={PrePanels}
          rootPrefix={rootPrefix}
          sidebarStatus={!sidebarLocked}
          sidebarWidth={DefSidebarWidth}
        />
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
}