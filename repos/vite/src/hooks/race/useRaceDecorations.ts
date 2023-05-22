import type { MutableRefObject } from 'react'
import type { TRaceDecoRef, TEditorRef } from '@gobletqa/race'
import type {
  TRepoState,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { useRef } from 'react'
import { EEditorType } from '@types'
import { useOnEvent } from '@gobletqa/components'
import { updateRefs } from '@utils/decorations/updateRefs'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { getTypeFromId } from '@utils/decorations/getTypeFromId'
import { checkFailedSpec } from '@utils/decorations/checkFailedSpec'
import { buildDecoration } from '@utils/decorations/buildDecoration'
import { buildDecorationFrom } from '@utils/decorations/buildDecorationFrom'

import {
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerClearDecorationEvt,
} from '@constants'

export type THDecorations = {
  repo:TRepoState,
  rootPrefix:string
  decoRef:TRaceDecoRef
  editorRef:TEditorRef
}

export const useRaceDecorations = ({
  decoRef,
  rootPrefix,
}:THDecorations) => {

  const stepRef = useRef<TPlayerEventData|undefined>(undefined)
  const featureRef = useRef<TPlayerEventData|undefined>(undefined)
  const scenarioRef = useRef<TPlayerEventData|undefined>(undefined)

  useOnEvent<TPlayerResEvent>(PlayerEndedEvent, (event:TPlayerResEvent) => {
    // console.log(`------- PlayerEndedEvent -------`)
    // console.log(event)
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerErrorEvent, (event:TPlayerResEvent) => {
    // console.log(`------- PlayerErrorEvent -------`)
    // console.log(event)
    const id = event?.data?.id
    const decoration = decoRef?.current
    if(!decoration || !id)
      return updateRefs({
        stepRef,
        featureRef,
        scenarioRef,
        clear: true
      })
    
    // TODO: update to handle errors here
    
  })


  useOnEvent<TPlayerResEvent>(PlayerClearDecorationEvt, (event:TPlayerResEvent) => {
    // console.log(`------- PlayerClearDecorationEvt -------`)
    // console.log(event)

    const { location } = event
    location && decoRef?.current?.clear?.(location)
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useOnEvent<TPlayerResEvent>(PlayerTestEvt, (event:TPlayerResEvent) => {
    // console.log(`------- PlayerTestEvt -------`)
    // console.log(event)

    const id = event?.data?.id
    const decoration = decoRef?.current
    if(!decoration || !id) return

    updateRefs({
      event,
      stepRef,
      featureRef,
      scenarioRef,
    })

    const dec = buildDecoration(event.data)
    const relative = event.location
    // const relative = rmRootFromLoc(event.location, rootPrefix)
    // decoRef?.current?.add(relative, dec, { action: event.data.action })

    checkFailedSpec({
      event,
      relative,
      featureRef,
      scenarioRef,
      add: decoRef?.current?.add,
      editor: EEditorType.visual,
    })

  })

}