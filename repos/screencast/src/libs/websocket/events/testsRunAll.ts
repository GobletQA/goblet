import type { Express } from 'express'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type {
  TSocketEvtCBProps,
  TKillTestRunUIRunEvtOpts,
} from '@GSC/types'

import path from 'path'
import { Logger } from '@GSC/utils/logger'
import { EE } from '@gobletqa/shared/utils'
import { ENVS } from '@gobletqa/environment'
import { limbo } from '@keg-hub/jsutils/limbo'
import { TestFromUI } from '@GSC/libs/testsFromUI/TestFromUI'
import { loadRepoFromSocket } from '@GSC/utils/loadRepoFromSocket'
import {
  InternalPaths,
  KillTestRunUIProcEvt,
} from '@gobletqa/environment/constants'

const cfgLoc = path.basename(__dirname).startsWith(`dist`)
  ? `dist/exam/exam.feature.config.js`
  : `src/exam/exam.feature.config.ts`

const testConfig = path.join(InternalPaths.testifyDir, cfgLoc)

const setupUIRun = async (args:TSocketEvtCBProps) => {
  const {
    data,
    user,
    socket,
    Manager,
  } = args

  const { repo } = await loadRepoFromSocket({
    user,
    repo: {
      ...data?.repo,
      username: data?.repo?.username ?? user.username,
      repoName: data?.repo?.name ?? path.basename(data?.repo?.remote || ``)
    },
  })

  const gobletToken = repo.latent.repoToken({
    ref: repo.$ref,
    remote: repo?.git?.remote
  })

  const testFromUI = new TestFromUI({
    repo,
    // This should come from the frontend
    // Hard-coding it for now until UI is updated
    // saveHtmlReport: data?.testRunOpts?.saveHtmlReport,
    // saveJsonReport: data?.testRunOpts?.saveJsonReport,
    saveHtmlReport: true,
    saveJsonReport: true,
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

    childProc = testFromUI.runTests({
      ...runOpts,
      extraEvtData: {
        group: socket.id,
        fullTestRun: true,
      },
      onFailed: (error) => {
        !testRunAborted
          && error
          && cleanup()
      },
      onDone: async (code) => {
        !testRunAborted && cleanup()
        res({ code })
      }
    })

    /**
     * Listen for the kill exam event to know if the user wants to abort the run
     * This allows the websocket events to be decoupled yet still communicate
     */
    let off = EE.on<TKillTestRunUIRunEvtOpts>(KillTestRunUIProcEvt, ({ procId }) => {
      Logger.info(`Aborting test run...`)
      
      /**
       * If we ever want to allow more then 1 run of exam from ui
       * We can use this and force passing in the pid
       * If the child pid doesn't match, then don't abort
       */
      // if(procId && childProc?.pid && procId !== childProc?.pid) return

      testRunAborted = true
      testFromUI.abortRun()

      let killed:boolean
      try { killed = childProc?.kill?.(`SIGKILL`) }
      catch(err){}

      cleanup()
      off?.()
      off = undefined
      Logger.log(`Test Run aborted. Child process killed: ${killed}`)
      res({ code: 130 })
    })

  })
  .finally(() => {
    if(ENVS.NODE_ENV !== `production`) return

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
