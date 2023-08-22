import type { IConstructable, TExArrClsOptMap } from "@GEX/types"
import {isArr} from "@keg-hub/jsutils/isArr"

export type TResolveTypeClass<T> = {
  opts?:any
  type?:TExArrClsOptMap<T>
  fallback?:IConstructable<T>
  override?:TExArrClsOptMap<T>
}

const checkTypeMap = <T>(item:TExArrClsOptMap<T>, opts:any) => {
  if(!item) return []
  if(!isArr(item)) return [item, opts]
  if(!item.length) return []

  const [cls, cOpts] = item

  return !cls ? [] : [cls, cOpts || opts]
}


export const resolveTypeClass = <T>(options:TResolveTypeClass<T>) => {
  const {
    opts,
    type,
    override,
    fallback,
  } = options
  
  let [foundCls, foundOpts] = checkTypeMap<T>(override, opts)

  if(!foundCls){
    let [tCls, tOpts] = checkTypeMap<T>(type, opts)
    foundCls = tCls
    foundOpts = foundOpts || tOpts
  }

  return [
    foundCls || fallback,
    foundOpts || opts
  ]
}