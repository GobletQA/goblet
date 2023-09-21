import type { Express } from 'express'

import { EE } from '@gobletqa/shared'
import { KillExamUIRunProcEvt } from '@gobletqa/environment/constants'
import {TKillExamUIRunEvtOpts} from '@GSC/types'

export const examAbort = (app:Express) => async ({ data }) => {
  EE.emit<TKillExamUIRunEvtOpts>(KillExamUIRunProcEvt, { procId: data.procId })
}
