import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { Logger } from '@GSC/utils/logger'
import { withRepo } from '@GSC/utils/withRepo'
import { restartBrowserCtx } from '@GSC/utils/restartBrowserCtx'
import { WSPwBrowserRestarted } from '@gobletqa/environment/constants'
  

export const browserRestart = (app:Express) => withRepo<TSocketEvtCBProps>(async (props) => {
  const { Manager } = props

  Logger.log(`Restarting screencast browser context...`)
  await restartBrowserCtx({
    ...props,
    url: props?.data?.url,
    browser: props?.data?.browser
  })

  Manager.emitAll(WSPwBrowserRestarted, {})

})

