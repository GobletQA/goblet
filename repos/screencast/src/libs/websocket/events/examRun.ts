import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import { runExamFromUi } from '@gobletqa/test-utils/exam/runExamFromUi'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'


const onExamRun = async (app:Express, {
  data,
  user,
  socket,
  Manager,
}:TSocketEvtCBProps) => {
  const { opts } = data
    const { repo } = await loadRepoFromSocket({
      user,
      repo: data?.repo,
    })

  await runExamFromUi(opts, {
    config: repo,
    world: repo.world,
    base: repo?.git?.local,
  })


}

export const examRun = (app:Express) => async (args:TSocketEvtCBProps) => onExamRun(app, args)
