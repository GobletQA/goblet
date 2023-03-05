import type { TFileModel } from './models.types'
import type {
  TRuleAst,
  TStepAst,
  TFeatureAst,
  TBackgroundAst
} from '@ltipton/parkin'

export enum EStepVariant {
  regex = 'regex',
  expression = 'expression'
}

export type TStepToken = {
  [key:string]: any
}

export enum EExpParmKind {
  url = `url`,
  text = `text`,
  alias = `alias`,
  pairs = `pairs`,
  group = `group`,
  number = `number`,
  element = `element`,
  selector = `selector`,
}

export enum EExpParmType {
  any = `any`,
  int = `int`,
  word = `word`,
  array = `array`,
  float = `float`,
  string = `string`,
  number = `number`,
  object = `object`,
}

export type TStepParent = {
  uuid: string
  location: string
}


export enum EAstObjects {
  feature = `feature`,
  rule = `rule`,
  background = `background`,
  scenario = `scenario`,
  step = `step`
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

export type TScenarioAst = {
  index: number
  uuid: string
  tags: string[]
  scenario: string
  steps: TStepAst[]
}

export type TAstType = TFeatureAst | TRuleAst | TBackgroundAst | TScenarioAst | TStepAst

export type TFeatureFileModel = Omit<TFileModel, 'ast'> & {
  ast: TFeatureAst|TFeatureAst[]
}

export type TFeatureFileModelList = Record<string, TFeatureFileModel>



