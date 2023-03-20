import type {
  TSetFeature,
  TSetIndexes,
  TRaceFeature,
} from '../types'
import type { TIndexAst } from '@ltipton/parkin'

import { useParkin } from './ParkinContext'
import { emptyArr } from '@keg-hub/jsutils'
import { MemoChildren } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

export type TFeatureProvider = {
  children:any
  initialFeature?:TRaceFeature
}

export type TFeatureCtx = {
  indexes:TIndexAst
  feature?:TRaceFeature
  setFeature:TSetFeature
  setIndexes:TSetIndexes
}

export const FeatureContext = createContext<TFeatureCtx>({} as TFeatureCtx)
export const useFeature = () => useContext(FeatureContext)

export const FeatureProvider = (props:TFeatureProvider) => {
  const {
    children,
    initialFeature,
  } = props

  const { parkin } = useParkin()
  const initIndexes = useMemo(() => {
    return initialFeature
    ? parkin?.indexes?.toIndexes(initialFeature as any)
    : (emptyArr as TIndexAst)
  }, [initialFeature])

  const [indexes, setIndexes] = useState<TIndexAst>(initIndexes)
  const [feature, setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  // const _setFeature:TSetFeature = useInline((feature:TRaceFeature|undefined) => {
  //   const indexes = feature ? parkin?.indexes?.toIndexes(feature) : (emptyArr as TIndexAst)
  //   setIndexes(indexes)
  //   setFeature(feature)
  // })

  const featureCtx:TFeatureCtx = useMemo(() => ({
    feature,
    indexes,
    setFeature,
    setIndexes,
  }), [feature, indexes])

  return (
    <FeatureContext.Provider value={featureCtx}>
      <MemoChildren children={children} />
    </FeatureContext.Provider>
  )

}
