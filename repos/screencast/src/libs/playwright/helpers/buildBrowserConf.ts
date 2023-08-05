import type {
  EBrowserType,
  TBrowserConf,
} from '@GSC/types'

import { checkVncEnv } from '@gobletqa/shared'
import { getBrowserType } from '../helpers/getBrowserType'
import { getContextOpts } from '../helpers/getContextOpts'
import { toBool, noOpObj, deepMerge } from '@keg-hub/jsutils'


export const buildBrowserConf = (
  browserConf:TBrowserConf = noOpObj as TBrowserConf,
  browserServer?:boolean
):TBrowserConf => {
  const { isKube, socketActive } = checkVncEnv()

  return deepMerge(browserConf, {
    type: getBrowserType(browserConf.type as EBrowserType),
    context: getContextOpts(browserConf?.context || noOpObj),
    ws: toBool(browserConf?.ws || browserServer || isKube || socketActive),
  })
}