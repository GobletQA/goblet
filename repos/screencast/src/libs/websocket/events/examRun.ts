import type { Express } from 'express'
import type { TPlayerTestEventMeta, TSocketEvtCBProps } from '@GSC/types'

import path from 'path'
import { Logger } from '@GSC/utils/logger'
import { latentRepo } from '@gobletqa/repo'
import { ENVS } from '@gobletqa/environment'
import { ExamUIRun } from '@GSC/libs/exam/examUIRun'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { runExamFromUi } from '@gobletqa/test-utils/exam/runExamFromUi'
import { InternalPaths, ExamJsonReporterEvtSplit } from '@gobletqa/environment/constants'

const testConfig = path.join(
  InternalPaths.testUtilsDir,
  `src/exam/exam.feature.config.ts`
)

const onExamRun = async (app:Express, args:TSocketEvtCBProps) => {
  const {
    data,
    user,
    socket,
    Manager,
  } = args

  try {

    const { examOpts } = data
    const { repo } = await loadRepoFromSocket({
      user,
      repo: data?.repo,
    })

    const examUi = new ExamUIRun({
      repo,
      onEvent: (evt) => Manager.emit(socket, evt.name, evt),
      onRunFinish: (evt) => Manager.emit(socket, evt.name, evt),
    })

    const gobletToken = latentRepo.repoToken({
      ref: repo.$ref,
      remote: repo?.git?.remote
    })
    
    const extra:Partial<TPlayerTestEventMeta> = {
      group: socket.id,
      fullTestRun: true,
    }

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
          const events = examUi.parseEvent({ data, ref: ExamJsonReporterEvtSplit })
          events?.length && examUi.onEvtsParsed({ events, extra })
        },
        onStdErr: (data:string) => {
          const events = examUi.parseEvent({ data, ref: ExamJsonReporterEvtSplit })
          events?.length && examUi.onEvtsParsed({ events, extra })
        },
        onError: (error:Error) => {
          examUi.cleanup()
          Logger.error(`UI-Exam Error:`)
          Logger.log(error)
        },
        onExit: async (code) => {
          examUi.runFinish({ code })

          Logger.log(`UI-Exam finished with exit code: ${code}`)
        },
      }
    )
  }
  finally {
    // Ensure the force safe disable gets reset
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
  }

}

export const examRun = (app:Express) => async (args:TSocketEvtCBProps) => await onExamRun(app, args)
