import type { Express } from 'express'
import type { Socket } from 'socket.io'
import type { TExTestEventMeta, TExEventData } from "@gobletqa/exam"
import type { TSocketEvtCBProps } from '@GSC/types'

import path from 'path'
import { Logger } from '@GSC/utils/logger'
import { latentRepo } from '@gobletqa/repo'
import { ENVS } from '@gobletqa/environment'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { runExamFromUi } from '@gobletqa/test-utils/exam/runExamFromUi'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'
import { InternalPaths, ExamJsonReporterEvtSplit } from '@gobletqa/environment/constants'

type TLocEvt = (TExEventData & { location:string })

const testConfig = path.join(
  InternalPaths.testUtilsDir,
  `src/exam/exam.feature.config.ts`
)

const parseEventData = (data:string) => {
  const events:TExTestEventMeta[] = []
  if(!data.includes(ExamJsonReporterEvtSplit)) return events

  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
  data.split(ExamJsonReporterEvtSplit)
    .forEach((evt:string) => {
      const cleaned = evt.trim()
      if(!cleaned) return

      try {
        const parsed = JSON.parse(evt)
        events.push(parsed)
      }
      catch(err){
        Logger.empty()
        Logger.error(`[JSON Event Error] - Error parsing JSON event`)
        Logger.pair(`[JSON Event]`, evt)
        Logger.log(`------`)
        Logger.empty()
      }
    })
  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined

  return events
}


const handleParsedEvts = ({
  data,
  user,
  socket,
  Manager,
}:TSocketEvtCBProps) => {
  // TODO: send event data to frontend // full test html reporter
  return (evts:TExTestEventMeta[]) => {
    const formatted = evts.map(evt => formatTestEvt(evt))
    console.log(require('util').inspect(formatted, false, null, true))
  }
}

const onExamRun = async (app:Express, args:TSocketEvtCBProps) => {
  const {
    data,
    user,
    socket,
    Manager,
  } = args
  
  const { examOpts } = data
  const handleEvts = handleParsedEvts(args)

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
      ...examOpts,
      testConfig,
      gobletToken,
      testColors: false,
      base: repo?.git?.local,
    },
    {
      onStdOut: (data:string) => {
        const events = parseEventData(data)
        events?.length && handleEvts(events)
      },
      onStdErr: (data:string) => {
        const events = parseEventData(data)
        events?.length && handleEvts(events)
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
