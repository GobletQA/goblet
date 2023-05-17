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
    world,
    settings,
    features,
    connected,
    rootPrefix,
    definitions,
    onWorldChange,
    onFolderCreate,
    onFeatureClose,
    onFeatureDelete,
    onFeatureChange,
    onFeatureActive,
    onFeatureCreate,
    onSettingChange,
  } = useRaceHooks()

  const menuContext = useContextMenu()

  return connected
    ? (
        <>
          {/* <DragSelect /> */}
          <RaceEditor
            {...props}
            world={world}
            actions={Actions}
            Divider={Divider}
            settings={settings}
            features={features}
            PrePanels={PrePanels}
            rootPrefix={rootPrefix}
            menuContext={menuContext}
            definitions={definitions}
            onWorldChange={onWorldChange}
            sidebarStatus={sidebarLocked}
            onFolderCreate={onFolderCreate}
            onFeatureClose={onFeatureClose}
            sidebarWidth={SidebarOpenWidth}
            onSettingChange={onSettingChange}
            onFeatureDelete={onFeatureDelete}
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