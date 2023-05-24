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

  const [cache, setCache] = useState<TDecoCache>({
    cache: {},
    feature: feature.uuid,
  })

  const addDecoration = useInline<TRaceDecoAdd>((location, deco, meta) => {
    const updates = upsertDecos({
      cache,
      feature,
      location,
      decorations,
      updates:[deco],
      parent: parentRef.current
    })
    
    const item = updates.cache.cache[deco.id]

    item
      && checkActiveParent(deco, meta)
      && (parentRef.current = item as TParentAst)

    updates.cache !== cache && setCache(updates.cache)
    setDecorations(updates.decorations)

  })

  const clearDecorations = useInline<TRaceDecoClear>((location:string) => {
    if(!decorations[location]) return

    const decos = {...decorations}
    delete decos[location]

    setDecorations(decos)
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
      decorations,
      updates:decos,
      parent: parentRef.current
    })

    updates.cache !== cache && setCache(updates.cache)
    setDecorations(updates.decorations)
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