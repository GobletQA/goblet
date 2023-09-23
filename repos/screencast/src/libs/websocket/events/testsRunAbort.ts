import type { Express } from 'express'
import type { TKillTestRunUIRunEvtOpts } from '@GSC/types'

import { EE } from '@gobletqa/shared'
import { KillTestRunUIProcEvt } from '@gobletqa/environment/constants'

export const testsRunAbort = (app:Express) => async ({ data }) => {
  EE.emit<TKillTestRunUIRunEvtOpts>(KillTestRunUIProcEvt, { procId: data.procId })
}
