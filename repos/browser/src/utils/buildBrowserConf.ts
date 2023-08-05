import type {
  EBrowserType,
  TBrowserConf,
  TGobletConfig,
} from '@GBR/types'

import { socketActive } from '@GBR/utils/checkVncEnv'
import { getBrowserType } from '@GBR/utils/getBrowserType'
import { getContextOpts } from '@GBR/utils/getContextOpts'
import { toBool, emptyObj, deepMerge } from '@keg-hub/jsutils'


export type TBuildBrowserCfg = {
  config?:TGobletConfig
  browserServer?:boolean
  browserConf?:TBrowserConf,
}

export const buildBrowserConf = (args:TBuildBrowserCfg):TBrowserConf => {
  const {
    config,
    browserServer,
    browserConf=emptyObj as TBrowserConf,
  } = args

  return deepMerge(browserConf, {
    type: getBrowserType(browserConf.type as EBrowserType),
    ws: toBool(browserConf?.ws || browserServer || socketActive()),
    context: getContextOpts({ config, contextOpts: browserConf?.context }),
  })
}