import type { TRaceSteps } from './steps.types'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type { Dispatch, SetStateAction, MutableRefObject, CSSProperties } from 'react'

export type TStepsRef = MutableRefObject<TRaceSteps>
export type TFeaturesRef = MutableRefObject<TRaceFeatures>

export type TOnFeatureCBRef = MutableRefObject<TOnFeatureCB>
export type TOnReturnFeatureCBRef = MutableRefObject<TOnReturnFeatureCB>
export type TOnFeatureCB = (feature?:TRaceFeature, ...rest:any[]) => void
export type TOnReturnFeatureCB = (feature?:TRaceFeature, ...rest:any[]) => TRaceFeature|undefined
export type TSetFeature = Dispatch<SetStateAction<TRaceFeature | undefined>>
