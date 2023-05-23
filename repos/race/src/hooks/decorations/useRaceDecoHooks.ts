import { MutableRefObject, useRef } from 'react'
import type { TAstType, TStepParentAst } from '@ltipton/parkin'
import type {
  TRaceDecoRef,
  TRaceDecoCtx,
  TRaceDecoFns,
  TRaceDecoAdd,
  TRaceDecoClear,
  TSetDecorations,
  TRaceDecorations,
  TRaceDecoUpdate,
  TRaceDeco,
  TRaceDecoMeta,
} from '@GBR/types'

import { useEffect, useState } from 'react'
import { EAstObject } from '@ltipton/parkin'
import { useInline } from '@gobletqa/components'
import { useEditor } from '@GBR/contexts/EditorContext'
import { fromDecoration } from '@gobletqa/race/utils/editor/fromDecoration'

export type THDecoration = {
  decorations:TRaceDecorations
  setDecorations:TSetDecorations
}


const checkActiveParent = (
  deco:TRaceDeco,
  meta:TRaceDecoMeta
) => {
  return meta.action === `start` &&  (deco.type === EAstObject.scenario || deco.type === EAstObject.background)
}

type TDecoCache = {
  feature:string
  cache: Record<string, TAstType>
}

export const useRaceDecoHooks = (props:THDecoration) => {
  const {
    decorations,
    setDecorations
  } = props


  const { feature } = useEditor()
  const parentRef = useRef<TStepParentAst>()

  const [cache, setCache] = useState<TDecoCache>({
    cache: {},
    feature: feature.uuid,
  })

  const addDecoration = useInline<TRaceDecoAdd>((location, deco, meta) => {
    const item = cache.cache[deco.id]
      || fromDecoration({
          deco,
          feature,
          cache: cache.cache,
          parent: parentRef.current
        })

    if(!item.uuid)
      return console.warn(`[Race Deco] Can not add decoration, failed to match ID`, feature, deco)


    const decos = {...decorations}
    decos[location] = {...decos[location], [item.uuid]: deco}

    checkActiveParent(deco, meta)
      && (parentRef.current = item as TStepParentAst)

    ;setDecorations(decos)
    setCache({...cache, cache:{ ...cache.cache, [deco.id]: item }})

  })

  const clearDecorations = useInline<TRaceDecoClear>((location:string) => {
    if(!decorations[location]) return

    const decos = {...decorations}
    delete decos[location]

    setDecorations(decos)
    setCache({ feature: feature.uuid, cache: {} })
  })

  const updateDecorations = useInline<TRaceDecoUpdate>((location, decoration, meta) => {
    // console.log(`------- location -------`)
    // console.log(location)
    // console.log(`------- decoration -------`)
    // console.log(decoration)
    // const decos = {...decorations}
    // decos[location] = {...decos[location], ...decoration}

    // setDecorations(decos)
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