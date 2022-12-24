import type {
  TRaceFeature,
  TOnFeatureCB,
  TOnFeatureCBRef,
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
  children: any
  initialFeature?:TRaceFeature
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureUpdateRef:TOnFeatureCBRef
  onFeatureBeforeChangeRef:TOnReturnFeatureCBRef
}

export type TFeatureCtx = {
  feature: TRaceFeature
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
    initialFeature,
    onFeatureChangeRef,
    onFeatureUpdateRef,
    onFeatureBeforeChangeRef,
  } = props

  const [feature, _setFeature] = useState<TRaceFeature|undefined>(initialFeature)

  const {
    setFeature,
    updateFeature,
  } = useFeatureCallbacks({
    onFeatureChangeRef,
    onFeatureUpdateRef,
    setFeature:_setFeature,
    onFeatureBeforeChangeRef
  })

  const featureCtx:TFeatureCtx = useMemo(() => {
    return {
      setFeature,
      updateFeature,
      feature: (feature || noOpObj) as TRaceFeature,
    }
  }, [feature, setFeature, updateFeature])

  return (
    <FeatureContext.Provider value={featureCtx}>
      <FeatureChild children={children} />
    </FeatureContext.Provider>
  )

}
