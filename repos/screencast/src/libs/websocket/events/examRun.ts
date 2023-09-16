import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import ExamConfig from '@gobletqa/test-utils/exam/exam.config'

const onExamRun = async (app:Express, {
  data,
  socket,
  Manager,
  user
}:TSocketEvtCBProps) => {

  // ExamConfig

}

export const examRun = (app:Express) => async (args:TSocketEvtCBProps) => onExamRun(app, args)
