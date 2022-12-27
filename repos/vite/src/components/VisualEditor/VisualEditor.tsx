import { RaceEditor } from '@gobletqa/race'
import { BlockIcon } from '@components/Icons'
import { EditorSidebarWidth } from '@constants'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'
import { PrePanels } from '@components/Panels/PrePanels'

export type TVisualEditor = {
  
}

export const VisualEditor = (props:TVisualEditor) => {

  const {
    steps,
    features,
    connected
  } = useRaceHooks()

  return connected
    ? (
        <RaceEditor
          steps={steps}
          actions={Actions}
          Divider={Divider}
          firstFeatureActive
          features={features}
          sidebarStatus={true}
          PrePanels={PrePanels}
          sidebarWidth={EditorSidebarWidth}
        />
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
}