import type { EBrowserType } from '@gobletqa/shared/enums'
import type {
  TGBWorldCfg,
  TBrowserConf,
  TGobletConfig,
} from '@GBB/types'

import { toBool } from '@keg-hub/jsutils/toBool'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { socketActive } from '@GBB/utils/checkVncEnv'
import { getBrowserType } from '@GBB/utils/getBrowserType'
import { getContextOpts } from '@GBB/utils/getContextOpts'

export type TBuildBrowserCfg = {
  world?:TGBWorldCfg
  config?:TGobletConfig
  browserServer?:boolean
  browserConf?:TBrowserConf,
}

export const buildBrowserConf = (args:TBuildBrowserCfg):TBrowserConf => {
  const {
    world,
    config,
    browserServer,
    browserConf=emptyObj as TBrowserConf,
  } = args

  const type = getBrowserType(browserConf?.type as EBrowserType)

  return deepMerge(browserConf, {
    type,
    ws: toBool(browserConf?.ws || browserServer || socketActive()),
    context: getContextOpts({
      type,
      world,
      config,
      contextOpts: browserConf?.context,
    }),
  }, world?.$browser)
}