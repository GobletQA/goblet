import type { TFeatureAst } from '@ltipton/parkin'
import type { TRaceDecoRef, TEditorRef, TRaceDeco, TRaceDecoAdd, TRaceDecoUpdate, TRaceDecoMeta } from '@gobletqa/race'
import type {
  TFileTree,
  TFileModel,
  TRepoState,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'


import { useRef } from 'react'
import { EEditorType } from '@types'
import { useOnEvent } from '@gobletqa/components'
import { updateRefs } from '@utils/decorations/updateRefs'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { checkFailedSpec } from '@utils/decorations/checkFailedSpec'
import { buildDecoration } from '@utils/decorations/buildDecoration'
import {
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  TestsToSocketEvtMap,
  PlayerClearDecorationEvt,
} from '@constants'


export type THDecorations = {
  repo:TRepoState
  files:TFileTree
  rootPrefix:string
  decoRef:TRaceDecoRef
  editorRef:TEditorRef
}

type TFileMeta = {
  location:string
  relative:string
  file: TFileModel
  feature: TFeatureAst
}

export const useRaceDecorations = ({
  decoRef,
  rootPrefix,
}:THDecorations) => {

  const fileRef = useRef<TFileMeta|undefined>(undefined)
  const stepRef = useRef<TPlayerEventData|undefined>(undefined)
  const featureRef = useRef<TPlayerEventData|undefined>(undefined)
  const scenarioRef = useRef<TPlayerEventData|undefined>(undefined)

  useOnEvent<TPlayerResEvent>(PlayerEndedEvent, (event:TPlayerResEvent) => {
    updateRefs<TFileMeta>({
      fileRef,
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerErrorEvent, (event:TPlayerResEvent) => {
    const id = event?.data?.id
    const decoration = decoRef?.current
    if(!decoration || !id)
      return updateRefs<TFileMeta>({
        fileRef,
        stepRef,
        featureRef,
        scenarioRef,
        clear: true
      })
    
    // TODO: update to handle errors here
    
  })


  useOnEvent<TPlayerResEvent>(PlayerClearDecorationEvt, (event:TPlayerResEvent) => {
    const { location } = event
    const relative = location && rmRootFromLoc(location, rootPrefix)
    relative && decoRef?.current?.clear?.(relative)

    updateRefs<TFileMeta>({
      fileRef,
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerTestEvt, (event:TPlayerResEvent) => {
    if(!event) return console.warn(`[Decoration Event] The "PlayerTestEvt" was fired without an event object`)

    if(event.name === TestsToSocketEvtMap.results) return

    const { data } = event

    const id = data?.id
    const decoration = decoRef?.current
    if(!decoration || !id)
      return console.warn(`[Decoration Event] Missing decoration reference or event.data.id in "PlayerTestEvt"`)

    updateRefs<TFileMeta>({
      event,
      fileRef,
      stepRef,
      featureRef,
      scenarioRef,
    })

    const { location } = event
    const relative = rmRootFromLoc(location, rootPrefix)
    const dec = buildDecoration<TRaceDeco, TFeatureAst>({
      event: data,
      testPath: data.testPath,
      editor: EEditorType.visual,
    })

    const decos = checkFailedSpec<TRaceDeco>({
      event,
      featureRef,
      scenarioRef,
      editor: EEditorType.visual,
    })

    const meta = { action: event.data.action } as TRaceDecoMeta

    decos.length
      ? decoRef?.current?.update?.(relative, decos.concat([dec]), meta)
      : decoRef?.current?.add(relative, dec, meta)

  })

}