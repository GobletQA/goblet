import type { Dispatch, SetStateAction } from 'react'

export enum EEditKey {
  step=`step`,
  rule=`rule`,
  ruleTitle=`ruleTitle`,
  ruleScenario=`ruleScenario`,
  scenario=`scenario`,
  scenarioStep=`scenarioStep`,
  scenarioTitle=`scenarioTitle`,
  backgroundStep=`backgroundStep`,
  backgroundTitle=`backgroundTitle`,
  featureMeta=`featureMeta`,
  featureTitle=`featureTitle`,
  featureScenario=`featureScenario`,
}

export type TEditing = {
  [K in EEditKey]?: string|boolean
}

export type TSetEditing = Dispatch<SetStateAction<TEditing>>

export type TEditingCtx = {
  editing: TEditing
  clearEditing:() => void
  setEditing:(payload:TEditingPayload) => void
  stopEditing:(payload:Omit<TEditingPayload, `value`>) => void
}

export type TEditingPayload = {
  key: keyof TEditing
  value: boolean|string
}

export type TEditingAction = {
  type:string
  payload?:TEditingPayload
}