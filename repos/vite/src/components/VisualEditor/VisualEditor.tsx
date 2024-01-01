import type { CSSProperties } from 'react'
import type { TEditorCtx } from '@gobletqa/race'

import { useRef } from 'react'
import { useApp } from '@store'
import { RaceEditor } from '@gobletqa/race'
import { Divider } from '@components/Divider/Divider'
import { RaceActions } from '../EditorActions/Actions'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'
import { PrePanels } from '@components/Panels/PrePanels'
import { useContextMenu } from '@hooks/race/useContextMenu'
import {
  BlockIcon,
  SidebarOpenWidth,
} from '@gobletqa/components'
import {useRaceActions} from '@hooks/race/useRaceActions'


export type TVisualEditor = {
  portal?:string
  style?: CSSProperties
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
    lastOpened,
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
  const raceActions = useRaceActions()

  return connected
    ? (
        <RaceEditor
          {...props}
          {...raceActions}
          world={world}
          decoRef={decoRef}
          Divider={Divider}
          settings={settings}
          features={features}
          actions={RaceActions}
          editorRef={editorRef}
          PrePanels={PrePanels}
          rootPrefix={rootPrefix}
          menuContext={menuContext}
          definitions={definitions}
          openedFeatures={lastOpened}
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
      )
    : (
        <NotConnected
          Icon={BlockIcon}
          message='Repository not connected'
        />
      )
}