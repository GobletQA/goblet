import type { Conductor } from '@gobletqa/conductor/conductor'
import type { Express, Response } from 'express'

import type {
  TApp,
  TReqDef,
  TParsedQs,
  TAppLocals,
  TResLocals,
  TBackendConfig,
  TPReq as TPAReq,
  TBReq as TBAReq,
  TParamsDictionary
} from '@gobletqa/shared/types'

export type TBAppLocals = TAppLocals<TBackendConfig> & {
  conductor: Conductor
}
export type TBApp = TApp<TBAppLocals>

export type TBEDefReq<
  Params extends TParamsDictionary=TParamsDictionary,
  Body=any,
  Res=any,
  Query=TParsedQs,
> = TReqDef<
  Params,
  Body,
  Res,
  Query,
  TBApp
>



export type TBEParamReq<
  Params extends TParamsDictionary=TParamsDictionary,
  Res extends Record<string, any>=Record<string, any>,
  Query extends TParsedQs=TParsedQs,
> = TPAReq<Params, Res, Query, TBApp>

export type TBEBodyReq<
  Body extends Record<string, any>=Record<string, any>,
  Res extends Record<string, any>=Record<string, any>,
  Query extends TParsedQs=TParsedQs,
> = TBAReq<
  Body,
  Res,
  Query,
  TBApp
>

export type TBEResp<Res extends Record<string, any>=Record<string, any>> = Response<
  Res,
  TResLocals
>



