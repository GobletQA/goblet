import type {TSetFeature, TRaceFeature } from '../types'

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
  feature?:TRaceFeature
  setFeature:TSetFeature
}

export const FeatureContext = createContext<TFeatureCtx>({} as TFeatureCtx)
export const useFeature = () => useContext(FeatureContext)

export const FeatureProvider = (props:TFeatureProvider) => {
  const {
    children,
    initialFeature,
  } = props

  const [feature, setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  const featureCtx:TFeatureCtx = useMemo(() => ({
    feature,
    setFeature,
  }), [feature])

  return (
    <FeatureContext.Provider value={featureCtx}>
      <MemoChildren children={children} />
    </FeatureContext.Provider>
  )

}
