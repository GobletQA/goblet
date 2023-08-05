import type { EBrowserName, TGetBrowsers } from '@GBR/types'

import { EBrowserType } from '@GBR/types'
import { browserNames, browserMap } from '@GBR/constants'
import {eitherArr, noPropArr, isStr} from '@keg-hub/jsutils'

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
    .filter((type:string) => browserNames.includes(type as EBrowserName))

  const found = Array.from(
    new Set([
      ...browsersArr,
      (allBrowsers || firefox) && EBrowserType.firefox,
      (allBrowsers || chromium) && EBrowserType.chromium,
      (allBrowsers || webkit) && EBrowserType.webkit,
    ])
  ).filter(Boolean)

  return found.length ? found : [EBrowserType.chromium]
}
