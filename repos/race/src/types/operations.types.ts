import { TRaceAst, TRaceFeature, TRaceGran, TRaceParentAst } from "./features.types"

export enum EOperations {
  cut=`cut`,
  copy=`copy`,
  paste=`paste`
}

export type TRaceOpData = {
  item:TRaceAst,
  from?:EOperations
  gran?: TRaceGran
  feature?:TRaceFeature
  parent?: TRaceParentAst
}

export type TOperationsUpdate = {
  type:EOperations
  data?:TRaceOpData
}

export type TSetOperations = (update:TOperationsUpdate) => void


export type TRaceOperations = {
  [K in EOperations]?:TRaceOpData|undefined
}
