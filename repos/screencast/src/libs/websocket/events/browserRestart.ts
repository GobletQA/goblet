import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { withRepo } from '@GSC/utils/withRepo'
import { WSPwBrowserRestarted } from '@GSC/constants'
import { restartBrowser } from '@GSC/utils/restartBrowser'
  

export const browserRestart = (app:Express) => withRepo<TSocketEvtCBProps>(async (props) => {
  const { Manager } = props

  await restartBrowser({
    ...props,
    url: props?.data?.url,
    browser: props?.data?.browser
  })

  Manager.emitAll(WSPwBrowserRestarted, {})

})

