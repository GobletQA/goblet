import type { IConstructable } from '@GEX/types'


export const isConstructor = <T=any>(check:any):check is IConstructable<T> => {
  try { Reflect.construct(String, [], check) }
  catch (e) { return false }

  return true
}
