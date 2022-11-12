import {
  isStr,
  isArr,
  exists,
  noOpObj,
} from '@keg-hub/jsutils'

type TParsedEnvArr = { [k: string]: string[] }
const emptyObj = noOpObj as TParsedEnvArr

/**
 * Parses a json stringified object
 */
export const parseJsonEnvArr = <T extends string>(key:T, value:string|string[]):TParsedEnvArr => {
  if(!exists(value)) return emptyObj
  if(isArr(value)) return {[key]: value}

  try {
    const parsed = JSON.parse(value)
    /**
     * Only add the parsed value if it's an array
     * And it's got a value
     */
    return isArr<string[]>(parsed) && parsed.length
      ? { [key]: parsed }
      : emptyObj
  }
  catch (e){
    /**
     * Only try to split if it's a non-empty string 
     */
    return isStr(value) && value.length
      ? {[key]: value.split(',')}
      : emptyObj
  }
}
