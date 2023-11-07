import type { Repo } from './workflows.types'
import type { Express, Request } from 'express'
import type { TTokenUser } from './user.types'
import type { TDefGobletConfig } from './configs.types'

export type TParsedQs = { [key: string]: undefined | string | string[] | TParsedQs | TParsedQs[] }

export type TParamsDictionary = {
  [key: string]: string
}

// TODO: this is no longer used
// Either remove it, or move TailLogger to shared repo
export type TailLogger = {
  start: () => void
}

export type TExLocals = Record<string, any>

export type TAppLocals<T extends TExLocals=TExLocals> = {
  repo?: Repo
  tailLogger?:TailLogger
  config:TDefGobletConfig & T
}

export type TApp<L=TAppLocals> = Express & {
  locals: L & TAppLocals
}

export type TResLocals = {
  repo?:Repo
  subdomain?:string
}

export type TReqDef<
  Params extends TParamsDictionary=TParamsDictionary,
  Body=any,
  Res=any,
  Query=TParsedQs,
  App extends Express=TApp
> = Omit<Request<
  Params,
  Res,
  Body,
  Query,
  TResLocals
>, `app`> & {
  app: App
  auth?:TTokenUser
}

export type TAppOvReq<
  App extends Express=TApp,
  Params extends TParamsDictionary=TParamsDictionary,
> = TReqDef<Params, any, any, TParsedQs, App>

export type TPReq<
  Params extends TParamsDictionary,
  Res extends Record<string, any>,
  Query extends TParsedQs=TParsedQs,
  App extends Express=TApp
> = TReqDef<Params, {}, Res, Query, App>

export type TBReq<
  Body extends Record<string, any>=Record<string, any>,
  Res extends Record<string, any>=Record<string, any>,
  Query extends TParsedQs=TParsedQs,
  App extends Express=TApp
> = TReqDef<
  TParamsDictionary,
  Body,
  Res,
  Query,
  App
>

