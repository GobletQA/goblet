import { RaceEditor } from '@gobletqa/race'
import { BlockIcon } from '@components/Icons'
import { EditorSidebarWidth } from '@constants'
import { Divider } from '@components/Layout/Divider'

import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'

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
          Divider={Divider}
          firstFeatureActive
          features={features}
          sidebarStatus={true}
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