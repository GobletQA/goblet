import type { TParentAst } from '@ltipton/parkin'
import type {
  TDecoCache,
  TRaceDecoFns,
  TRaceDecoAdd,
  TOnFeatureEvt,
  TRaceDecoClear,
  TSetDecorations,
  TRaceDecorations,
  TRaceDecoUpdate,
} from '@GBR/types'

import { useRef, useEffect, useState } from 'react'
import { useEditor } from '@GBR/contexts/EditorContext'
import { RaceOnFeatureEvt } from '@GBR/constants/events'
import { useSettings } from '@GBR/contexts/SettingsContext'
import { useInline, useOnEvent } from '@gobletqa/components'
import { upsertDecos } from '@gobletqa/race/utils/decorations/upsertDecos'
import { checkActiveParent } from '@gobletqa/race/utils/decorations/checkActiveParent'

export type THDecoration = {
  decorations:TRaceDecorations
  setDecorations:TSetDecorations
}

export const useRaceDecoHooks = (props:THDecoration) => {
  const {
    decorations,
    setDecorations
  } = props

  const { feature } = useEditor()
  const { settings } = useSettings()
  const parentRef = useRef<TParentAst>()
  /**
   * The decorations can sometimes be updated too quickly
   * The setDecorations method is called multiple times
   * Before the decorations object in the context can be updated
   * This causes events to be missed in some decorations do not get displayed
   * 
   * To fix this, we create a cached ref version of the decorations
   * And all updates are applied to it first
   * Because it's just a simple object, updates to it are stored instantly
   * And don't require updating the decorations context
   * We then pass that on to the setDecorations method
   * This way they always are up to date, and nothing is missed
   */
  const decosRef = useRef<TRaceDecorations>(decorations)

  /**
   * Caches reference to feature properties
   * So we don't have to look them up each time
   */
  const [cache, setCache] = useState<TDecoCache>({
    cache: {},
    feature: feature.uuid,
  })

  const addDecoration = useInline<TRaceDecoAdd>((location, deco, meta) => {
    const updates = upsertDecos({
      cache,
      feature,
      location,
      updates:[deco],
      parent: parentRef.current,
      decorations: decosRef.current,
    })
    
    const item = updates.cache.cache[deco.id]

    item
      && checkActiveParent(deco, meta)
      && (parentRef.current = item as TParentAst)

    updates.cache !== cache && setCache(updates.cache)
    decosRef.current = updates.decorations
    setDecorations(decosRef.current)

  })

  const clearDecorations = useInline<TRaceDecoClear>((location:string) => {
    if(!decorations[location]) return

    const decos = {...decorations}
    delete decos[location]

    decosRef.current = decos
    setDecorations(decosRef.current)
    setCache({ feature: feature.uuid, cache: {} })
  })

  // Listen for any changes to the feature and clear out decorations
  useOnEvent<TOnFeatureEvt>(RaceOnFeatureEvt, ({ feature }) => {
    settings.autoClearDecorations
      && clearDecorations(feature.path)
  })

  const updateDecorations = useInline<TRaceDecoUpdate>((location, decos, meta) => {
    const updates = upsertDecos({
      cache,
      feature,
      location,
      updates:decos,
      parent: parentRef.current,
      decorations: decosRef.current,
    })

    updates.cache !== cache && setCache(updates.cache)
    decosRef.current = updates.decorations
    setDecorations(decosRef.current)
  })

  useEffect(() => {
    feature.uuid !== cache.feature
      && setCache({ feature: feature.uuid, cache: {} })
  }, [feature, cache])

  return {
    add: addDecoration,
    clear: clearDecorations,
    update: updateDecorations,
  } as TRaceDecoFns

}