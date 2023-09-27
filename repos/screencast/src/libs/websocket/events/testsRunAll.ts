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
import { TestFromUI } from '@GSC/libs/testsFromUI/TestFromUI'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
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

  const testFromUI = new TestFromUI({
    repo,
    runTimestamp: new Date().getTime(),
    eventSplit: ENVS.EXAM_EVENT_LOG_SPLIT_KEY,
    extraEvt: { group: socket.id, fullTestRun: true },
    onEvent: (evt) => Manager.emit(socket, evt.name, evt),
    onRunFinish: (evt) => Manager.emit(socket, evt.name, evt),
  })

  return {
    testFromUI,
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
    let testRunAborted = false

    const { testFromUI, runOpts } = await setupUIRun(args)

    let childProc:ChildProcessWithoutNullStreams

    const cleanup = () => {
      if(cleanupCalled) return
      cleanupCalled = true

      testFromUI.cleanup()
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

    childProc = testFromUI.runTests(runOpts, {
      onStdOut: (data:string) => {
        if(testRunAborted) return

        const events = testFromUI.parseEvent({ data })
        events?.length && testFromUI.onEvtsParsed({ events, extra: getExtra() })
      },
      onStdErr: (data:string) => {
        if(testRunAborted) return

        const events = testFromUI.parseEvent({ data })
        events?.length && testFromUI.onEvtsParsed({ events, extra: getExtra() })
      },
      onError: (error:Error) => {
        if(testRunAborted) return

        Logger.error(`UI-Exam Error:`)
        Logger.log(error)

        cleanup()
      },
      onExit: async (code) => {
        if(testRunAborted) return res({ code })

        await testFromUI.runFinish({ code, extra: getExtra() })
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

      testRunAborted = true
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
