import type { TTabAction } from '@gobletqa/components'
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
  children: any
  initialFeature?:TRaceFeature
  onFeatureCloseRef:TOnFeatureCBRef
  onFeatureActiveRef:TOnFeatureCBRef
  onFeatureChangeRef:TOnFeatureCBRef
  onFeatureInactiveRef:TOnFeatureCBRef
  setFeatureGroups:TSetFeatureGroups
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
