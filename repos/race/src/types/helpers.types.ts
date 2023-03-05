import type { TStepDefsList } from '@ltipton/parkin'
import type { TRaceFeatures, TRaceFeature } from './features.types'
import type { Dispatch, SetStateAction, MutableRefObject } from 'react'

export type TStepDefsRef = MutableRefObject<TStepDefsList>
export type TFeaturesRef = MutableRefObject<TRaceFeatures>
export type TSetFeatureRefs = (features:TRaceFeatures) => void
export type TSetFeatureGroups = Dispatch<SetStateAction<TRaceFeatures | undefined>>


export type TOnFeatureCBRef = MutableRefObject<TOnFeatureCB>
export type TOnReturnFeatureCBRef = MutableRefObject<TOnReturnFeatureCB>
export type TFeatureCB = (feature: TRaceFeature) => void
export type TOnFeatureCB = (feature?:TRaceFeature, ...rest:any[]) => void
export type TOnReturnFeatureCB = (feature?:TRaceFeature, ...rest:any[]) => TRaceFeature|undefined
export type TSetFeature = Dispatch<SetStateAction<TRaceFeature | undefined>>