import { capitalize, isStr, emptyObj } from '@keg-hub/jsutils'

export const findFailed = <T=Record<any, any>>(
  type:string|T,
  pType:string,
  ...rest:any[]
) => {
  
  let resp = emptyObj as T
  if(!isStr(type) && isStr(rest[0])){
    resp = type
    type = pType
    pType = rest.shift()
  }

  console.warn(
    `[ Find Failed Error ] - ${capitalize(type as string)} could not be found on parent ${capitalize(pType)}`,
    ...rest
  )

  return resp
}