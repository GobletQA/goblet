import type { MutableRefObject } from 'react'
import type { TEditorRefHandle } from '@gobletqa/monaco'
import type {
  TRepoState,
  TPlayerResEvent,
} from '@types'


import { useRef } from 'react'
import { useEventListen } from '../useEvent'
import { rmRootFromLoc } from '@utils/repo/rmRootFromLoc'
import { buildDecoration } from '@utils/editor/buildDecoration'
import { PlayerTestEvt, PlayerClearDecorationEvt, PlayerErrorEvent } from '@constants'

export type THDecorations = {
  editorRef:MutableRefObject<TEditorRefHandle|null>,
  repo:TRepoState,
  rootPrefix:string
}

export const useDecorations = ({
  repo,
  editorRef,
  rootPrefix,
}:THDecorations) => {

  const stepRef = useRef()
  const featureRef = useRef()
  const scenarioRef = useRef()

  useEventListen<TPlayerResEvent>(PlayerErrorEvent, (event:TPlayerResEvent) => {
    const id = event?.data?.id
    const decoration = editorRef?.current?.decoration
    if(!decoration || !id) return
    
    const { data, location } = event
    // Build Error decorations here

  })


  useEventListen<TPlayerResEvent>(PlayerClearDecorationEvt, (event:TPlayerResEvent) => {
    const { location } = event
    const decoration = editorRef?.current?.decoration
    location && decoration?.clear(location)
  })

  useEventListen<TPlayerResEvent>(PlayerTestEvt, (event:TPlayerResEvent) => {

    console.log(`------- event -------`)
    console.log(event)

    const id = event?.data?.id
    const decoration = editorRef?.current?.decoration
    if(!decoration || !id) return

    const { data, location } = event
    
    
    const dec = buildDecoration(data)
    const relative = rmRootFromLoc(location, rootPrefix)

    decoration?.add(relative, dec, { action: data.action })

  })

}