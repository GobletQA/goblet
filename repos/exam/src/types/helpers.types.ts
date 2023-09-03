
export interface IConstructable<T> {
  new(...args: any) : T
}

type TAnyCls = {
  [key:string]:any
}

type TArrOptMapOpts = Record<any, any>|Array<any>
type TArrStrOptMap<Opts extends TArrOptMapOpts=TArrOptMapOpts> = string|[string]|[string, Opts]

export type TExecutorArrClsOptMap<
  Cls extends TAnyCls=TAnyCls,
  Opts extends TArrOptMapOpts=TArrOptMapOpts
> = [IConstructable<Cls>, Opts]

export type TExArrClsOptMap<
  Cls extends TAnyCls=TAnyCls,
  Opts extends TArrOptMapOpts=TArrOptMapOpts
> = IConstructable<Cls>|[IConstructable<Cls>]|[IConstructable<Cls>, Opts]

export type TExArrOptsMap<
  Cls extends TAnyCls=TAnyCls,
  Opts extends TArrOptMapOpts=TArrOptMapOpts
> = TArrStrOptMap | TExArrClsOptMap<Cls, Opts>

export type TExTypeOpts<
  Cls extends TAnyCls=TAnyCls,
  Opts extends TArrOptMapOpts=TArrOptMapOpts
> = {
  [key:string]:TExArrOptsMap<Cls, Opts>
}
