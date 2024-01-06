import type { TFileModel } from './models.types'
import type {
  TRuleAst,
  TStepAst,
  TFeatureAst,
  TScenarioAst,
  TBackgroundAst
} from '@ltipton/parkin'

export type TStepToken = {
  [key:string]: any
}

export type TStepParent = {
  uuid: string
  location: string
}

export enum EStepKey {
  given=`given`,
  when=`when`,
  then=`then`,
  and=`and`,
  but=`but`,
  Given=`given`,
  When=`when`,
  Then=`then`,
  And=`and`,
  But=`but`,
} 

export type TAstType = TFeatureAst | TRuleAst | TBackgroundAst | TScenarioAst | TStepAst

export type TFeatureFileModel = Omit<TFileModel, 'ast'> & {
  ast: TFeatureAst|TFeatureAst[]
}

export type TFeatureFileModelList = Record<string, TFeatureFileModel>



