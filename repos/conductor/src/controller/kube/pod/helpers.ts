import { exists } from '@keg-hub/jsutils/exists'

export const addIfExists = (
  parent:Record<string, any>,
  key:string,
  value:any
) => {
  exists(value) && (parent[key] = value)

  return parent
}