import type { Exam } from '@GEX/Exam'
import type {
  TLoadOpts,
  TExArrClsOptMap,
} from '@GEX/types'

import { isConstructor } from '@GEX/utils/isConstructor'
import { emptyArr, emptyObj, isArr, isObj, isStr} from '@keg-hub/jsutils'

const emptyArrOpts = emptyArr as TExArrClsOptMap<undefined, undefined>

export const convertTypeStrToCls = async <T=any, O=any>(
  exam:Exam,
  type:TExArrClsOptMap<T, O>,
  options:TLoadOpts
):Promise<TExArrClsOptMap<T, O>> => {

  if(isArr(type)){
    const [item, opts] = type
    const loaded = isStr(item)
      ? await exam.loader.load(item, options)
      : isConstructor<T>(item) ? item : undefined

    return loaded
      ? [loaded, opts]
      : emptyArrOpts
  }
  else if(isConstructor<T>(type))
    return [type, emptyObj as O]

  else if(isObj<T>(type))
    return [type, emptyObj as O]

  else if(isStr(type)){
    const loaded = await exam.loader.load(type, options)
    return [loaded, emptyObj as O]
  }

  return emptyArrOpts
}