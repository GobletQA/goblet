import type { CSSProperties } from 'react'
import type { TSelectFromBrowserEvent } from '@gobletqa/components'

import { useApp } from '@store'
import { RaceEditor } from '@gobletqa/race'
import { Actions } from '../EditorActions/Actions'
import { Divider } from '@components/Layout/Divider'
import { NotConnected } from '@components/NotConnected'
import { useRaceHooks } from '@hooks/race/useRaceHooks'
import { PrePanels } from '@components/Panels/PrePanels'
import {
  BlockIcon,
  DragSelect,
  useEventListen,
  DefSidebarWidth,
  SelectFromBrowserEvt,
} from '@gobletqa/components'

import { selectElement } from '@actions/socket/api/selectElement'

export type TVisualEditor = {
  portal?:string
  style?: CSSProperties
}

export const VisualEditor = (props:TVisualEditor) => {
  const { sidebarLocked } = useApp()
  const {
    steps,
    features,
    connected,
    rootPrefix
  } = useRaceHooks()

  useEventListen<TSelectFromBrowserEvent>(
    SelectFromBrowserEvt,
    ({ parent, step, expression }) => selectElement()
  )

  return connected
    ? (
        <>
          {/* <DragSelect /> */}
          <RaceEditor
            {...props}
            steps={steps}
            actions={Actions}
            Divider={Divider}
            features={features}
            PrePanels={PrePanels}
            rootPrefix={rootPrefix}
            sidebarStatus={!sidebarLocked}
            sidebarWidth={DefSidebarWidth}
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