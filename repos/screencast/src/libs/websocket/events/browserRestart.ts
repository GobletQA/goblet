import type { Express } from 'express'
import type { TSocketEvtCBProps } from '@GSC/types'

import { withRepo } from '@GSC/utils/withRepo'
import { restartContext } from '@GSC/utils/restartContext'

export const browserRestart = (app:Express) => withRepo<TSocketEvtCBProps>(async (props) => {
  await restartContext({
    ...props,
    url: props?.data?.url,
    browser: props?.data?.browser
  })
})

