import type {
  TRaceIndex,
  TSetFeature,
  TSetIndexes,
  TRaceFeature,
} from '../types'

import { emptyArr } from '@keg-hub/jsutils'
import { MemoChildren, useInline } from '@gobletqa/components'
import { featureToIndexes } from '@GBR/utils/indexes/featureToIndexes'
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
  indexes:TRaceIndex
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

  const initIndexes = useMemo(() => {
    return initialFeature ? featureToIndexes(initialFeature) : (emptyArr as TRaceIndex)
  }, [initialFeature])

  const [indexes, setIndexes] = useState<TRaceIndex>(initIndexes)
  const [feature, setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  // const _setFeature:TSetFeature = useInline((feature:TRaceFeature|undefined) => {
  //   const indexes = feature ? featureToIndexes(feature) : (emptyArr as TRaceIndex)
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
