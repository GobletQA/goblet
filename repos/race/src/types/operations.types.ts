import { TRaceAst } from "./features.types"

export enum EOperations {
  cut=`cut`,
  copy=`copy`,
  paste=`paste`
}

export type TOperationsUpdate = {
  data?:any
  type:EOperations
}

export type TSetOperations = (update:TOperationsUpdate) => void

export type TRaceOperations = {
  [K in EOperations]?:TRaceAst|undefined
}
