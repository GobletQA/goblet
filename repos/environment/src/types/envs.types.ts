import type general from '../envs/general'

export type TAnyFun = (...args:any[]) => any

export type TEnvObj = Record<string, any>

export type TEnvRec<T extends TEnvObj> = T & TEnvObj

export type TEnvArg<T extends TAnyFun> = ReturnType<T>
export type TEnvFun<T extends TAnyFun> = (obj?:TEnvArg<T>) => any


export type TEnvF = TEnvFun<typeof general>
export type TGenEnv = TEnvArg<typeof general>