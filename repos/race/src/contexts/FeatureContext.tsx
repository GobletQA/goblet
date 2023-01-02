import type {
  TRaceFeature,
  TOnFeatureCB,
  TOnFeatureCBRef,
  TSetFeatureGroups,
  TOnReturnFeatureCBRef,
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
  initialFeature?:TRaceFeature
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureInactiveRef:TOnFeatureCBRef
  setFeatureGroups:TSetFeatureGroups
  onFeatureBeforeChangeRef:TOnReturnFeatureCBRef
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
    initialFeature,
    setFeatureGroups,
    onFeatureCloseRef,
    onFeatureChangeRef,
    onFeatureActiveRef,
    onFeatureInactiveRef,
    onFeatureBeforeChangeRef,
  } = props

  const [feature, _setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    feature,
    rootPrefix,
    setFeatureGroups,
    onFeatureCloseRef,
    onFeatureActiveRef,
    onFeatureChangeRef,
    onFeatureInactiveRef,
    setFeature:_setFeature,
    onFeatureBeforeChangeRef
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
