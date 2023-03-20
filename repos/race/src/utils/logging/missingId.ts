import { capitalize } from '@keg-hub/jsutils'

export const missingId = (
  type:string,
  prefix:string=`[ Missing ID Error ]`,
  ...rest:any[]
) => {
  return console.warn(`${prefix} - Missing ${capitalize(type)} ID`, ...rest)
}