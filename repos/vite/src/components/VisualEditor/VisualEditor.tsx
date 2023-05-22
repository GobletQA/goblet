import type { CSSProperties } from 'react'
import type { TEditorCtx } from '@gobletqa/race'

import { useRef } from 'react'
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
  const editorRef = useRef<TEditorCtx>(null)
  
  const {
    world,
    decoRef,
    settings,
    features,
    connected,
    rootPrefix,
    definitions,
    onWorldChange,
    onFeatureClose,
    onFeatureDelete,
    onFeatureRename,
    onFeatureChange,
    onFeatureActive,
    onFeatureCreate,
    onSettingChange,
  } = useRaceHooks(editorRef)

  const menuContext = useContextMenu()

  return connected
    ? (
        <>
          {/* <DragSelect /> */}
          <RaceEditor
            {...props}
            world={world}
            decoRef={decoRef}
            actions={Actions}
            Divider={Divider}
            settings={settings}
            features={features}
            editorRef={editorRef}
            PrePanels={PrePanels}
            rootPrefix={rootPrefix}
            menuContext={menuContext}
            definitions={definitions}
            onWorldChange={onWorldChange}
            sidebarStatus={sidebarLocked}
            onFeatureClose={onFeatureClose}
            sidebarWidth={SidebarOpenWidth}
            onSettingChange={onSettingChange}
            onFeatureRename={onFeatureRename}
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