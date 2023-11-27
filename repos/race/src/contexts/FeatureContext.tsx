import type {TSetFeature, TRaceFeature } from '../types'

import { exists } from '@keg-hub/jsutils'
import { MemoChildren, useInline } from '@gobletqa/components'
import {
  useMemo,
  useState,
  useContext,
  createContext,
  ComponentType,
} from 'react'

export type TFeatureProvider = {
  children:any
  initialFeature?:TRaceFeature
  FeatureComponent?:ComponentType<any>
}

export type TFeatureUIOverride = (props:{ Component?:ComponentType<any>, override?:boolean }) => void
export type TFeatureCtx = {
  feature?:TRaceFeature
  setFeature:TSetFeature
  featureUIActive?:boolean
  FeatureComponent?:ComponentType<any>
  overrideFeatureUI: TFeatureUIOverride
}

export const FeatureContext = createContext<TFeatureCtx>({} as TFeatureCtx)
export const useFeature = () => useContext(FeatureContext)

export const FeatureProvider = (props:TFeatureProvider) => {
  const {
    children,
    initialFeature,
  } = props

  const [feature, setFeature] = useState<TRaceFeature|undefined>(initialFeature)
  const [uiOverride, setUIOverride] = useState<boolean>(false)
  const [
    FeatureComponent,
    setFeatureComponent
  ] = useState<ComponentType<any>|undefined>(props.FeatureComponent)

  const overrideFeatureUI = useInline<TFeatureUIOverride>(({ Component, override }) => {
    Component && setFeatureComponent(Component)

    const ov = exists<boolean>(override) ? override : !uiOverride
    setUIOverride(ov)
  })

  const featureCtx:TFeatureCtx = useMemo(() => ({
    feature,
    setFeature,
    setUIOverride,
    FeatureComponent,
    overrideFeatureUI,
    setFeatureComponent,
    featureUIActive: uiOverride,
  }), [
    feature,
    uiOverride,
    FeatureComponent
  ])

  return (
    <FeatureContext.Provider value={featureCtx}>
      <MemoChildren children={children} />
    </FeatureContext.Provider>
  )

}
