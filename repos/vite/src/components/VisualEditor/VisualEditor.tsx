import type { CSSProperties } from 'react'


import { useApp } from '@store'
import { RaceEditor } from '@gobletqa/race'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'
import { useContextMenu } from '@hooks/race/useContextMenu'
import { PrePanels } from '@components/Panels/PrePanels'
import {
  BlockIcon,
  EThemeMode,
  SidebarOpenWidth,
} from '@gobletqa/components'


export type TVisualEditor = {
  portal?:string
  style?: CSSProperties
  // themeType?: EThemeMode
}

export const VisualEditor = (props:TVisualEditor) => {
  const { sidebarLocked } = useApp()
  const {
    steps,
    world,
    features,
    connected,
    rootPrefix,
    onWorldChange,
    onFeatureClose,
    onFeatureChange,
    onFeatureActive,
    onFeatureCreate,
  } = useRaceHooks()

  const menuContext = useContextMenu()

  return connected
    ? (
        <>
          {/* <DragSelect /> */}
          <RaceEditor
            {...props}
            steps={steps}
            world={world}
            actions={Actions}
            Divider={Divider}
            features={features}
            PrePanels={PrePanels}
            rootPrefix={rootPrefix}
            menuContext={menuContext}
            firstFeatureActive={true}
            onWorldChange={onWorldChange}
            sidebarStatus={!sidebarLocked}
            onFeatureClose={onFeatureClose}
            sidebarWidth={SidebarOpenWidth}
            onFeatureCreate={onFeatureCreate}
            onFeatureChange={onFeatureChange}
            onFeatureActive={onFeatureActive}
          />
        </>
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
}