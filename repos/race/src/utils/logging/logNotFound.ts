import { capitalize } from '@keg-hub/jsutils'

export const logNotFound = (
  type:string,
  prefix:string=`[ Not Found Error ]`,
  ...rest:any[]
) => {
  return console.warn(`${prefix} - ${capitalize(type)} could not be found on feature`, ...rest)
}