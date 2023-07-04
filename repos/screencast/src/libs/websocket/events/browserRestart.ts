import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { restartContext } from '@GSC/libs/playwright/browser/restartContext'

export const browserRestart = (app:Express) => {
  return async (props:TSocketEvtCBProps) => {
    await restartContext({
      ...props,
      url: props?.data?.url,
      browser: props?.data?.browser
    })
  }
}

