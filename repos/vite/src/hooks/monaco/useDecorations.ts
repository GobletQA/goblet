import type { MutableRefObject } from 'react'
import type { TEditorRefHandle, TDecoration, TDecorationMeta } from '@gobletqa/monaco'
import type {
  TRepoState,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { useRef } from 'react'
import { EEditorType } from '@types'
import { useOnEvent } from '@gobletqa/components'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { updateRefs } from '@utils/decorations/updateRefs'
import { checkFailedSpec } from '@utils/decorations/checkFailedSpec'
import { buildDecoration } from '@utils/decorations/buildDecoration'

import {
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerFinishedEvent,
  PlayerClearDecorationEvt,
} from '@constants'

export type THDecorations = {
  editorRef:MutableRefObject<TEditorRefHandle|null>,
  repo:TRepoState,
  rootPrefix:string
}

export const useDecorations = ({
  editorRef,
  rootPrefix,
}:THDecorations) => {

  const stepRef = useRef<TPlayerEventData|undefined>(undefined)
  const featureRef = useRef<TPlayerEventData|undefined>(undefined)
  const scenarioRef = useRef<TPlayerEventData|undefined>(undefined)

  useOnEvent<TPlayerResEvent>(PlayerFinishedEvent, (event:TPlayerResEvent) => {
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerErrorEvent, (event:TPlayerResEvent) => {
    const id = event?.data?.id
    const decoration = editorRef?.current?.decoration
    if(!decoration || !id)
      return updateRefs({
        stepRef,
        featureRef,
        scenarioRef,
        clear: true
      })

    // Handle spec failed here - animation?
  })


  useOnEvent<TPlayerResEvent>(PlayerClearDecorationEvt, (event:TPlayerResEvent) => {
    const { location } = event
    if(!location) return

    const relative = rmRootFromLoc(location, rootPrefix)
    const decoration = editorRef?.current?.decoration
    relative && decoration?.clear(relative)
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerTestEvt, (event:TPlayerResEvent) => {
    const id = event?.data?.id
    const location = event?.location
    const decoration = editorRef?.current?.decoration
    if(!decoration || !id || !location) return

    updateRefs({
      event,
      stepRef,
      featureRef,
      scenarioRef,
    })

    const dec = buildDecoration<TDecoration>({ event: event.data, editor: EEditorType.code })
    const relative = rmRootFromLoc(location, rootPrefix)
    const meta = { action: event?.data?.action }
    const decos = checkFailedSpec<TDecoration>({
      event,
      featureRef,
      scenarioRef,
      editor: EEditorType.code,
    })

    decos.length
      ? decoration?.update(relative, decos.concat([dec]), meta as TDecorationMeta)
      : decoration?.add(relative, dec, meta as TDecorationMeta)
  })

}