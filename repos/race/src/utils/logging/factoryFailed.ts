import { capitalize } from '@keg-hub/jsutils'

export const factoryFailed = (
  type:string,
  prefix:string=`[ Factory Failed Error ]`,
  ...rest:any[]
) => {
  return console.warn(`${prefix} - ${capitalize(type)} Factory failed to build ${type}`, ...rest)
}