import type { TExamCfgArgs } from './exam.config'
import type { TInitExamOpts } from '@gobletqa/exam'

import { exam } from '@gobletqa/exam'
import ExamConfig from './exam.config'
import {emptyObj} from '@keg-hub/jsutils/emptyObj'

export const examUIRun = async (
  opts:TInitExamOpts=emptyObj,
  cfg:TExamCfgArgs=emptyObj,
) => {
  return await exam(ExamConfig(cfg), opts)
}