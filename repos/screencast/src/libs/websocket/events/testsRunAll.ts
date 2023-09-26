import type { Express } from 'express'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type {
  TExamEvtExtra,
  TSocketEvtCBProps,
  TKillTestRunUIRunEvtOpts,
} from '@GSC/types'

import path from 'path'
import { EE } from '@gobletqa/shared'
import { Logger } from '@GSC/utils/logger'
import { latentRepo } from '@gobletqa/repo'
import { ENVS } from '@gobletqa/environment'
import { limbo } from '@keg-hub/jsutils/limbo'
import { ExamUIRun } from '@GSC/libs/exam/examUIRun'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import { runExamFromUi } from '@gobletqa/test-utils/exam/runExamFromUi'
import {
  InternalPaths,
  KillTestRunUIProcEvt,
} from '@gobletqa/environment/constants'


const testConfig = path.join(InternalPaths.testUtilsDir, `src/exam/exam.feature.config.ts`)


const setupUIRun = async (args:TSocketEvtCBProps) => {
  const {
    data,
    user,
    socket,
    Manager,
  } = args

  const { repo } = await loadRepoFromSocket({
    user,
    repo: data?.repo,
  })

  const gobletToken = latentRepo.repoToken({
    ref: repo.$ref,
    remote: repo?.git?.remote
  })

  const examUI = new ExamUIRun({
    repo,
    runTimestamp: new Date().getTime(),
    eventSplit: ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
    extraEvt: { group: socket.id, fullTestRun: true },
    onEvent: (evt) => Manager.emit(socket, evt.name, evt),
    onRunFinish: (evt) => Manager.emit(socket, evt.name, evt),
  })

  return {
    examUI,
    runOpts: {
      ...data.testRunOpts,
      testConfig,
      gobletToken,
      testColors: false,
      base: repo?.git?.local,
    }
  }

}

const onExamRun = async (args:TSocketEvtCBProps) => {
  const { socket } = args

  return new Promise(async (res) => {

    let cleanupCalled = false
    let examRunAborted = false

    const { examUI, runOpts } = await setupUIRun(args)

    let childProc:ChildProcessWithoutNullStreams

    const cleanup = () => {
      if(cleanupCalled) return
      cleanupCalled = true

      examUI.cleanup()
      childProc = undefined
    }

    /**
     * Extra args to add to the events
     * Is a function to allow accessing the child proc id within the event callbacks
     */
    const getExtra = ():Partial<TExamEvtExtra> => ({
      group: socket.id,
      fullTestRun: true,
      procId: childProc?.pid,
    })

    childProc = runExamFromUi(runOpts, {
      onStdOut: (data:string) => {
        if(examRunAborted) return

        const events = examUI.parseEvent({ data })
        events?.length && examUI.onEvtsParsed({ events, extra: getExtra() })
      },
      onStdErr: (data:string) => {
        if(examRunAborted) return

        const events = examUI.parseEvent({ data })
        events?.length && examUI.onEvtsParsed({ events, extra: getExtra() })
      },
      onError: (error:Error) => {
        if(examRunAborted) return

        Logger.error(`UI-Exam Error:`)
        Logger.log(error)

        cleanup()
      },
      onExit: async (code) => {
        if(examRunAborted) return res({ code })

        await examUI.runFinish({ code, extra: getExtra() })
        Logger.log(`UI-Exam finished with exit code: ${code}`)

        cleanup()
        res({ code })
      }
    })

    /**
     * Listen for the kill exam event to know if the user wants to abort the run
     * This allows the websocket events to be decoupled yet still communicate
     */
    let off = EE.on<TKillTestRunUIRunEvtOpts>(KillTestRunUIProcEvt, ({ procId }) => {
      /**
       * If we ever want to allow more then 1 run of exam from ui
       * We can use this and force passing in the pid
       * If the child pid doesn't match, then don't abort
       */
      // if(procId && childProc?.pid && procId !== childProc?.pid) return

      examRunAborted = true
      !childProc?.killed && childProc?.kill?.(`SIGKILL`)

      cleanup()
      off?.()
      off = undefined
      res({ code: 130 })
    })

  })
  .finally(() => {
    // Ensure the force safe disable gets reset
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
  })

}


export const testsRunAll = (app:Express) => async (args:TSocketEvtCBProps) => {
  // TODO: Investigate if the exit code should be sent back to the frontend ?
  const [err, res] = await limbo(onExamRun(args))
  if(!err) return

  Logger.error(`Exam UI Run Error:`)
  Logger.log(err.stack)

}
