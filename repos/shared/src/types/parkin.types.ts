/**
 * Most of the types in this file should be exported from parkin instead
 * They were added before parkin had types, but now that it does they should be updated
 */
import type {
  Parkin,
  TStepDef,
  EHookType,
  TFeatureAst,
  EExpParmType,
  TWorldConfig,
} from '@ltipton/parkin'


export type TParse = Parkin["parse"]
export type TMatcher = Parkin["matcher"]
export type TParkinSteps = Parkin["steps"]
export type TAssemble = Parkin["assemble"]

export type TParkinHookName = keyof typeof EHookType
export type TParkinHookMethod = (method:(...args:any[]) => any) => void

export interface IParkinHooks {
  instance:Parkin
  types:TParkinHookName[]
  afterAll:TParkinHookMethod
  beforeAll:TParkinHookMethod
  afterEach:TParkinHookMethod
  beforeEach:TParkinHookMethod
  getRegistered:(type:TParkinHookName) => () => void
}


export type TParamType = {
  regex: string|RegExp
  useForSnippets: boolean
  name: EExpParmType|string
  type: EExpParmType|string
  preferForRegexpMatch: boolean
  transformer: (...args:any[]) => any
}

export type TParamTypeMap = Record<EExpParmType|string, TParamType>

export type TParamTypes = {
  register: (paramType:TParamType) => TParamTypeMap
}

export type TMatchResp = {
  match?: string[]
  definition?:TStepDef
}

export enum EPartMatchTypes {
  other = `other`,
  optional = `optional`,
  alternate = `alternate`,
  parameter = `parameter`,
}

export type TPartsMatch = {
  index:number
  input:string
  text: string
  regex: RegExp
  type: EPartMatchTypes
  paramType: EExpParmType
}

export type TExpFindResp = {
  escaped:string
  regexAlts:string
  regexAnchors:string
  regexConverted:string
  found:TMatchResp,
  transformers:TParamType[]
}

export type TMatchTokens = {
  type:string
  match:string
  index:number
  defIndex:number
}

export type TParkinRunOpts = {
  name?:string
  tags?: string|string[]
}

export type TParkinRun = (
  data:string|string[]|TFeatureAst|TFeatureAst[],
  options:TParkinRunOpts
) => any


export type TWorldJokerCfg = {}
export type TGBWorldCfg = TWorldConfig & {
  joker?:TWorldJokerCfg
}