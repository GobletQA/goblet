import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { restartBrowser } from '@GSC/libs/playwright/browser/restartBrowser'

export const browserRestart = (app:Express) => {
  return async (props:TSocketEvtCBProps) => {
    await restartBrowser({
      ...props,
      url: props?.data?.url,
      browser: props?.data?.browser
    })
  }
}

