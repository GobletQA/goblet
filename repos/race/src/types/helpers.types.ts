import type { TRaceSteps } from './steps.types'
import type { TRaceModels, TRaceModel } from './models.types'
import type { Dispatch, SetStateAction, MutableRefObject } from 'react'


export type TStepsRef = MutableRefObject<TRaceSteps>
export type TModelsRef = MutableRefObject<TRaceModels>

export type TOnModelCB = (model?:TRaceModel, ...rest:any[]) => void
export type TOnReturnModelCB = (model?:TRaceModel, ...rest:any[]) => TRaceModel|undefined
export type TSetModel = Dispatch<SetStateAction<TRaceModel | undefined>>
export type TOnModelCBRef = MutableRefObject<TOnModelCB>
export type TOnReturnModelCBRef = MutableRefObject<TOnReturnModelCB>