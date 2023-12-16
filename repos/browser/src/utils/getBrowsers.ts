import type { EBrowserName, TGetBrowsers } from '@gobletqa/shared/types'


import { isStr } from '@keg-hub/jsutils/isStr'
import { EBrowserType } from '@gobletqa/shared/enums'
import { noPropArr } from '@keg-hub/jsutils/noPropArr'
import { eitherArr } from '@keg-hub/jsutils/eitherArr'
import { BrowserNames, BrowserMap } from '@GBB/constants'


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
    .map((type:string) => BrowserMap[type] || type)
    .filter((type:string) => BrowserNames.includes(type as EBrowserName))

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
