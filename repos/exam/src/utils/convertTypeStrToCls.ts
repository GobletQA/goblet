import {Errors} from '@GEX/constants'
import type { Exam } from '@GEX/Exam'
import type {
  TLoadOpts,
  TExArrOptsMap,
  IConstructable,
  TExecutorArrClsOptMap
} from '@GEX/types'

import { isConstructor } from '@GEX/utils/isConstructor'
import { emptyArr, emptyObj, isArr, isFunc, isObj, isStr} from '@keg-hub/jsutils'

const emptyArrOpts = emptyArr as TExecutorArrClsOptMap<undefined, undefined>

const checkDefExport = <T=any>(
  loaded:any,
  item?:string,
  type?:string
) => {
  const cls = loaded.default || loaded

  if(!isConstructor<T>(cls) && !isFunc<IConstructable<T>>(cls) && !isObj<IConstructable<T>>(cls))
    Errors.LoadErr(
      new Error(`Custom ${type} must export a default class but none was found for ${item}`),
      item as string
    )

  return cls
}

export const convertTypeStrToCls = async <T=any, O=any>(
  exam:Exam,
  type:TExArrOptsMap<T, O>,
  options?:TLoadOpts,
  typeName?:string
):Promise<TExecutorArrClsOptMap<T, O>> => {

  if(isArr(type)){
    const [item, opts] = type
    const loaded = isStr(item)
      ? await exam.loader.load(item, options) as IConstructable<T>
      : isConstructor<T>(item) ? item : undefined

    const cls = checkDefExport(loaded)

    return cls
      ? [cls, opts] as TExecutorArrClsOptMap<T, O>
      : emptyArrOpts
  }
  else if(isConstructor<T>(type))
    return [type, emptyObj as O]

  else if(isFunc<IConstructable<T>>(type))
    return [type, emptyObj as O]

  else if(isStr(type)){
    const loaded = await exam.loader.load<IConstructable<T>>(type, options)
    const cls = checkDefExport(loaded)
    return [cls, emptyObj as O]
  }

  return emptyArrOpts
}