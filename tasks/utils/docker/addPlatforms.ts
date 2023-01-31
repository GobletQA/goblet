import { noPropArr } from '@keg-hub/jsutils'


/**
 * Generates a string of platforms the image should be built for
 */
export const addPlatforms = (platforms:string[] = noPropArr, push?:boolean) => {
  return platforms.length && push ? [`--platform`, platforms.join(`,`)] : noPropArr
}
