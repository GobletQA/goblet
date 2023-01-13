import type { MutableRefObject } from 'react'
import type { TEditorRefHandle, TDecorationAdd } from '@gobletqa/monaco'
import type {
  TRepoState,
  TPlayerResEvent,
  TPlayerEventData,
} from '@types'

import { useRef } from 'react'
import { PWPlay } from '@constants'
import { useEventListen } from '../useEvent'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { getTypeFromId } from '@utils/editor/getTypeFromId'
import { buildDecoration } from '@utils/editor/buildDecoration'
import { buildDecorationFrom } from '@utils/editor/buildDecorationFrom'
import {
  PlayerTestEvt,
  PlayerErrorEvent,
  PlayerEndedEvent,
  PlayerClearDecorationEvt,
} from '@constants'

export type THDecorations = {
  editorRef:MutableRefObject<TEditorRefHandle|null>,
  repo:TRepoState,
  rootPrefix:string
}

type TUpdateRefs = {
  event?:TPlayerResEvent
  clear?:boolean
  type?:`step`|`scenario`|`feature`
  stepRef:MutableRefObject<TPlayerEventData|undefined>
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

type TUpdateDecs = {
  relative:string
  add:TDecorationAdd
  event:TPlayerResEvent
  featureRef:MutableRefObject<TPlayerEventData|undefined>
  scenarioRef:MutableRefObject<TPlayerEventData|undefined>
}

const updateRefs = ({
  type,
  event,
  clear,
  stepRef,
  featureRef,
  scenarioRef,
}:TUpdateRefs) => {
  if(clear){
    stepRef.current = undefined
    featureRef.current = undefined
    scenarioRef.current = undefined
  }
  if(!event) return

  type = type || getTypeFromId(event.data)

  switch(type){
    case `step`: {
      stepRef.current = event.data
      break
    }
    case `scenario`: {
      scenarioRef.current = event.data
      break
    }
    case `feature`: {
      featureRef.current = event.data
      break
    }
  }
}

const checkFailedSpec = ({
  add,
  event,
  relative,
  featureRef,
  scenarioRef,
}:TUpdateDecs) => {
  if(!event) return

  if(PWPlay.playSpecDone === event.name && !event.data.passed){
    const featDeco = featureRef.current && buildDecorationFrom(event.data, featureRef.current)
    featDeco && add(relative, featDeco, { action: event.data.action })

    const sceDeco = scenarioRef.current && buildDecorationFrom(event.data, scenarioRef.current)
    sceDeco && add(relative, sceDeco, { action: event.data.action })
  }
}

export const useDecorations = ({
  editorRef,
  rootPrefix,
}:THDecorations) => {

  const stepRef = useRef<TPlayerEventData|undefined>(undefined)
  const featureRef = useRef<TPlayerEventData|undefined>(undefined)
  const scenarioRef = useRef<TPlayerEventData|undefined>(undefined)

  useEventListen(PlayerEndedEvent, (event:TPlayerResEvent) => {
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useEventListen<TPlayerResEvent>(PlayerErrorEvent, (event:TPlayerResEvent) => {
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


  useEventListen<TPlayerResEvent>(PlayerClearDecorationEvt, (event:TPlayerResEvent) => {
    const { location } = event
    const decoration = editorRef?.current?.decoration
    location && decoration?.clear(location)
    updateRefs({
      stepRef,
      featureRef,
      scenarioRef,
      clear: true
    })
  })

  useEventListen<TPlayerResEvent>(PlayerTestEvt, (event:TPlayerResEvent) => {

    const id = event?.data?.id
    const decoration = editorRef?.current?.decoration
    if(!decoration || !id) return

    updateRefs({
      event,
      stepRef,
      featureRef,
      scenarioRef,
    })

    const dec = buildDecoration(event.data)
    const relative = rmRootFromLoc(event.location, rootPrefix)
    decoration?.add(relative, dec, { action: event.data.action })

    checkFailedSpec({
      event,
      relative,
      featureRef,
      scenarioRef,
      add: decoration?.add
    })

  })

}