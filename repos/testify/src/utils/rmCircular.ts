import {isObj} from "@keg-hub/jsutils/isObj"

export const rmCircular = <T extends Record<any, any>=Record<any, any>>(data:T):string => {
  let cache = []
  const str = JSON.stringify(data, (key, value) => {
    if (isObj(value)) {
      if (cache.includes(value)) return `[Circular]`
      cache.push(value)
    }
    return value
  })

  cache = undefined

  return str
}
