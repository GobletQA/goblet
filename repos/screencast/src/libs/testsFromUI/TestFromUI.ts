/**
GB_LOGGER_FORCE_DISABLE_SAFE=1 GOBLET_RUN_FROM_UI=1 DISPLAY=0.0 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --no-cache --root /goblet/repos/lancetipton --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --colors false

GB_LOGGER_FORCE_DISABLE_SAFE=1 GOBLET_RUN_FROM_UI=1 DISPLAY=0.0 GOBLET_TEST_TYPE=bdd GOBLET_BROWSER=chromium GOBLET_CONFIG_BASE=/goblet/repos/lancetipton node -r esbuild-register ./repos/exam/src/bin/exam.ts --colors false --no-cache --config /goblet/app/repos/testUtils/src/exam/exam.feature.config.ts --root /goblet/repos/lancetipton --tags @whitelist

*/
import type { TExTestEventMeta } from "@gobletqa/exam"
import type { SpawnOptionsWithoutStdio } from 'child_process'
import type { TTestRun, TExamUIRun, TExamUIChildProcOpts } from '@GSC/types'

import type {
  Repo,
  TExamEvtExtra,
  TExamUIRunEvts,
  TExamUIRunOpts,
  TParsedEvtOpts,
  TExamUIRunEvtCB,
  TExamUIRunFinish,
  TExamUIRunFinishCB,
} from '@GSC/types'

import { spawn } from 'child_process'
import {isFunc} from "@keg-hub/jsutils"
import { Logger } from '@GSC/utils/logger'
import { ENVS } from '@gobletqa/environment'
import {isArr} from '@keg-hub/jsutils/isArr'
import { aliases } from '@GConfigs/aliases.config'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { ETestType, EBrowserType } from '@GSC/types'
import { Logger as EXLogger } from "@gobletqa/exam"
import { emptyObj } from "@keg-hub/jsutils/emptyObj"
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { buildBddEnvs } from '@gobletqa/test-utils/utils/buildBddEnvs'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'
import { buildTestArgs } from '@gobletqa/test-utils/utils/buildTestArgs'
import { TestsToSocketEvtMap, InternalPaths } from '@gobletqa/environment/constants'

import {
  getDefOpts,
  cleanRepoName,
} from './utils'


const runExam = (
  cfg:TExamUIChildProcOpts,
  cmd:string,
  args:string[],
  params:SpawnOptionsWithoutStdio
) => {

  EXLogger.log(`[Exam-CMD]`, `${cmd} ${args.join(` `)}`, params)

  const childProc = spawn(cmd, args, params)

  childProc.stdout && childProc.stdout.setEncoding(`utf-8`)
  childProc.stderr && childProc.stderr.setEncoding(`utf-8`)

  cfg?.onError && childProc.on(`error`, cfg.onError)
  cfg?.onExit && childProc.on(`exit`, cfg.onExit)
  cfg?.onStdOut && childProc?.stdout?.on?.(`data`, cfg.onStdOut)
  cfg?.onStdErr && childProc?.stderr?.on?.(`data`, cfg.onStdErr)

  return childProc
}


export class TestFromUI {
  repo:Repo
  runId:string
  rootDir:string
  testRun:TTestRun
  saveJsonReport?:boolean
  saveHtmlReport?:boolean
  htmlReportLoc?:string
  runTimestamp:number
  eventSplit?:string=``
  runAborted?:boolean=false
  events:TExamUIRunEvts = {}
  onEvent:TExamUIRunEvtCB[]=[]
  extraEvt:Partial<TExamEvtExtra>
  onRunFinish:TExamUIRunFinishCB[]=[]


  #safeLogData = (data:string) => {
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
    data && EXLogger.stdout(data)
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
  }

  #parseHtmlReportLoc = (data:string) => {
    const saveLoc =  data.split(`"`)[1]
    if(saveLoc) this.htmlReportLoc = saveLoc.trim?.()?.replace(InternalPaths.reportsTempDir, ``)
  }

  buildTestParams = (
    opts:TExamUIRun,
    cfg:TExamUIChildProcOpts,
  ) => {

    const cmdParams = pickKeys(cfg, [`env, stdio`, `detached`, `shell`, `gid`, `uid`])

    const params = buildBddEnvs({
      ...opts,
      // Default to headless true for now should be added on the frontend
      cwd: aliases?.GobletRoot,
      browser: EBrowserType.chromium,
      headless: opts?.headless ?? true,
    }, EBrowserType.chromium, ETestType.feature, true)
    
    return deepMerge<SpawnOptionsWithoutStdio>(
      getDefOpts(),
      cmdParams,
      params
    )
  }

  constructor(props:TExamUIRunOpts) {
    const {
      onEvent,
      eventSplit,
      onRunFinish,
      saveHtmlReport,
      saveJsonReport,
      extraEvt=emptyObj,
    } = props

    this.repo = props.repo
    this.extraEvt = extraEvt

    // This must core before `this.runId`, because `this.buildRunId` uses it
    this.runTimestamp = props.runTimestamp
    this.runId = this.buildRunId()

    this.testRun = {files: {}, runId: this.runId} as TTestRun

    onEvent && this.onEvent.push(props.onEvent)
    eventSplit && (this.eventSplit = props.eventSplit)
    onRunFinish && this.onRunFinish.push(props.onRunFinish)
    saveHtmlReport && (this.saveHtmlReport = props.saveHtmlReport)
    saveJsonReport && (this.saveJsonReport = props.saveJsonReport)

  }

  /**
   * Run exams/tests from UI in a child process
   * Main entry point for test execution
   */
  runTests = (
    opts:TExamUIRun=emptyObj as TExamUIRun,
    cfg:TExamUIChildProcOpts=emptyObj,
  ) => {
    const {
      onEvent,
      onError,
      onDone,
      onFailed,
      extraEvtData,
      ...rest
    } = opts
    
    const testCmd = buildTestArgs(rest)
    const [cmd, ...args] = testCmd
    const extraFunc = isFunc(extraEvtData) ? extraEvtData : () => (extraEvtData || {})

    const childProc = runExam({
      ...cfg,
      onStdOut:(data:string) => {
        if(this.runAborted) return
        const events = this.parseEvent({ data })
        onEvent?.(events)

        events?.length
          && this.onEvtsParsed({
              events,
              extra: {procId: childProc?.pid, ...extraFunc(events)}
            })

        cfg?.onStdOut?.(data)
      },
      onStdErr:(data:string) => {
        if(this.runAborted) return

        const events = this.parseEvent({ data })
        onError?.(events)

        events?.length
          && this.onEvtsParsed({
              events,
              extra: {procId: childProc?.pid, ...extraFunc(events)}
            })

        onError?.(events)
        cfg?.onStdErr?.(data)
      },
      onError:(error:Error) => {
        if(this.runAborted) return

        Logger.error(`UI-Exam Error:`)
        Logger.log(error)

        onFailed?.(error)
        cfg?.onError?.(error)
      },
      onExit: async (code) => {
        if(!this.runAborted) {
          await this.runFinish({ code, extra: extraFunc() })
          Logger.log(`UI-Exam finished with exit code: ${code}`)
        }
        
        onDone?.(code)
        cfg?.onExit?.(code)
      }
    }, cmd, args, this.buildTestParams(opts, cfg))

    return childProc
  }

  buildRunId = () => {
    return `${cleanRepoName(this.repo.name)}.${this.runTimestamp}`
  }


  runFinish = async (args:TExamUIRunFinish) => {
    const {cb, code, extra} = args

    const evtData = { data: { htmlReport: this.htmlReportLoc }} as Partial<TExTestEventMeta>
    const event = formatTestEvt(evtData, {
      message: `Test Suite finished`,
      name: TestsToSocketEvtMap.ended,
      ...this.extraEvt,
      runId: this.runId,
      error: !Boolean(code),
      runTimestamp: this.runTimestamp,
    }) as TExTestEventMeta

    ;[cb, ...this.onRunFinish].forEach(cb => cb && cb?.(event, this.testRun))

  }

  parseEvent = ({
    data,
    ref=this.eventSplit
  }:{ data:string, ref?:string }) => {
    const events:TExTestEventMeta[] = []
    if(!data.includes(ref)){

      this.saveHtmlReport
        && data.includes(`- Html Report saved to`)
        && this.#parseHtmlReportLoc(data)

      this.#safeLogData(data)

      return events
    }

    data.split(ref)
      .forEach((evt:string) => {
        const cleaned = evt.trim()
        if(!cleaned) return

        try { events.push(JSON.parse(evt)) }
        catch(err){ this.#safeLogData(evt) }
      })

    return events
  }

  onEvtsParsed = ({events, extra, cb}:TParsedEvtOpts) => {

    events.forEach(evt => {
      const formatted = formatTestEvt(evt, {
        ...this.extraEvt,
        runId: this.runId,
        runTimestamp: this.runTimestamp,
      }) as TExTestEventMeta

      ;[cb, ...this.onEvent].forEach(cb => cb && cb?.(formatted))
    })

    const data = events?.[0]?.data
    const loc = isArr(data) ? data[0]?.location : data.location
    if(!loc) return

    this.events[loc] = this.events[loc] || []
    this.events[loc].push(...events)
  }

  abortRun = () => {
    this.runAborted = true
  }

  cleanup = () => {
    this.repo = undefined
    this.events = {}
    this.events = undefined
    this.onEvent = []
    this.onEvent = undefined
  }

}
