import { browserNames, browserMap } from '@GSC/constants'
import {eitherArr, noPropArr, isStr} from '@keg-hub/jsutils'

export type TGetBrowsers = {
  webkit:boolean
  firefox:boolean
  chromium:boolean
  allBrowsers:boolean,
  browsers:string|string[]
}

/**
 * Creates an array of browsers relative the passed params object properties
 * The webkit option is only included when on a mac OS regardless of params properties
 */
export const getBrowsers = (params:TGetBrowsers) => {
  const {
    allBrowsers,
    webkit = false,
    firefox = false,
    chromium = false,
    browsers=noPropArr,
  } = params

  // get an array of browsers from the browsers string, comma or space delimited
  const browsersArr = eitherArr(browsers, isStr(browsers) ? browsers.split(/\s|,/gi) : noPropArr)
    .map((type:string) => browserMap[type] || type)
    .filter((type:string) => browserNames.includes(type))

  const found = Array.from(
    new Set([
      ...browsersArr,
      (allBrowsers || firefox) && 'firefox',
      (allBrowsers || chromium) && 'chromium',
      (allBrowsers || webkit) && 'webkit',
    ])
  ).filter(Boolean)

  return found.length ? found : [browserMap.chromium]
}
