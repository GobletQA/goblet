import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { TExEventData } from "@gobletqa/exam"
import type {
  SocketManager,
  TUserAutomateOpts,
  TSocketEvtCBProps,
} from '@GSC/types'

import path from 'path'
import { Logger } from '@GSC/utils/logger'
import { latentRepo } from '@gobletqa/repo'
import { ENVS } from '@gobletqa/environment'
import { runExamFromUi } from '@gobletqa/test-utils/exam/runExamFromUi'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { InternalPaths, ExamJsonReporterEvtSplit } from '@gobletqa/environment/constants'

type TLocEvt = (TExEventData & { location:string })

const testConfig = path.join(
  InternalPaths.testUtilsDir,
  `src/exam/exam.feature.config.ts`
)

const parseEventData = (data:string) => {
  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
  const events:TLocEvt[] = []

  data.split(ExamJsonReporterEvtSplit).forEach((evt:string) => {
    const cleaned = evt.trim()
    if(!cleaned) return

    try {
      const parsed = JSON.parse(evt)
      events.push(parsed)
    }
    catch(err){
      // TODO: clean this up
      console.log(``)
      console.log(`------- ERROR parsing to JSON -------`)
      console.log(evt)
      console.log(`------- ERROR parsing to JSON -------`)
      console.log(``)
    }
  })
  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined

  return events
}

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
  
  const gobletToken = latentRepo.repoToken({
    ref: repo.$ref,
    remote: repo?.git?.remote
  })

  await runExamFromUi(
    {
      ...opts,
      testConfig,
      gobletToken,
      testColors: false,
      base: repo?.git?.local,
    },
    {
      onStdOut: (data:string) => {
        // TODO: send event data to frontend // full test html reporter
        const events = parseEventData(data)
      },
      onStdErr: (data:string) => {
        // TODO: send event data to frontend // full test html reporter
        const events = parseEventData(data)
      },
      onError: (error:Error) => {
        ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
        Logger.error(`UI-Exam Error:`)
        Logger.log(error)
      },
      onExit: (code) => {
        ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
        Logger.log(`UI-Exam finished with exit code: ${code}`)
      },
    }
  )

}

export const examRun = (app:Express) => async (args:TSocketEvtCBProps) => onExamRun(app, args)
