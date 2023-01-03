import type {
  TRaceFeature,
  TOnFeatureCB,
  TFeaturesRef,
  TSetFeatureRefs,
  TSetFeatureGroups,
  TOnReturnFeatureCB,
} from '../types'

import {
  memo,
  useMemo,
  useState,
  useContext,
  createContext,
} from 'react'

import { noOpObj } from '@keg-hub/jsutils'
import { useFeatureCallbacks } from '../hooks/useFeatureCallbacks'

export type TFeatureProvider = {
  children:any
  rootPrefix:string
  featuresRef: TFeaturesRef
  initialFeature?:TRaceFeature
  onFeatureClose:TOnFeatureCB
  onFeatureChange:TOnFeatureCB
  onFeatureActive:TOnFeatureCB
  onFeatureInactive:TOnFeatureCB
  setFeatureRefs:TSetFeatureRefs
  setFeatureGroups:TSetFeatureGroups
  onBeforeFeatureChange:TOnReturnFeatureCB
}

export type TFeatureCtx = {
  rootPrefix:string
  feature:TRaceFeature
  setFeature:TOnFeatureCB
  updateFeature:TOnFeatureCB
}

type TFeatureChild = {
  children: any
}

export const FeatureContext = createContext<TFeatureCtx>({} as TFeatureCtx)

export const useFeature = () => {
  return useContext(FeatureContext)
}

const FeatureChild = memo((props:TFeatureChild) => {
  return (<>{props.children}</>)
})

export const FeatureProvider = (props:TFeatureProvider) => {
  const {
    children,
    rootPrefix,
    featuresRef,
    setFeatureRefs,
    initialFeature,
    onFeatureClose,
    setFeatureGroups,
    onFeatureChange,
    onFeatureActive,
    onFeatureInactive,
    onBeforeFeatureChange,
  } = props

  const [feature, _setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    feature,
    rootPrefix,
    featuresRef,
    setFeatureRefs,
    onFeatureClose,
    onFeatureChange,
    setFeatureGroups,
    onFeatureActive,
    onFeatureInactive,
    setFeature:_setFeature,
    onBeforeFeatureChange
  })

  const featureCtx:TFeatureCtx = useMemo(() => {
    return {
      setFeature,
      rootPrefix,
      updateFeature,
      feature: (feature || noOpObj) as TRaceFeature,
    }
  }, [
    feature,
    setFeature,
    rootPrefix,
    updateFeature,
  ])

  return (
    <FeatureContext.Provider value={featureCtx}>
      <FeatureChild children={children} />
    </FeatureContext.Provider>
  )

}
