import { emptyObj, exists } from '@keg-hub/jsutils'


export const toObj = <T=Record<string, any>>(key:string, item:any):T => {
  return (exists(item) ? { [key]:item } : emptyObj) as T
}
