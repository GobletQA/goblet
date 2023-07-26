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

export const convertTypeStrToCls = async <T=any, O=any>(
  exam:Exam,
  type:TExArrOptsMap<T, O>,
  options?:TLoadOpts
):Promise<TExecutorArrClsOptMap<T, O>> => {

  if(isArr(type)){
    const [item, opts] = type
    const loaded = isStr(item)
      ? await exam.loader.load(item, options) as IConstructable<T>
      : isConstructor<T>(item) ? item : undefined

    return loaded
      ? [loaded, opts] as TExecutorArrClsOptMap<T, O>
      : emptyArrOpts
  }
  else if(isConstructor<T>(type))
    return [type, emptyObj as O]

  else if(isFunc<IConstructable<T>>(type))
    return [type, emptyObj as O]

  else if(isStr(type)){
    const loaded = await exam.loader.load<IConstructable<T>>(type, options)
    return [loaded, emptyObj as O]
  }

  return emptyArrOpts
}