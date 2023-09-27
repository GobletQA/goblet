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

import path from 'node:path'
import { spawn } from 'child_process'
import { Logger } from '@GSC/utils/logger'
import { ENVS } from '@gobletqa/environment'
import {isArr} from '@keg-hub/jsutils/isArr'
import { aliases } from '@GConfigs/aliases.config'
import { pickKeys } from '@keg-hub/jsutils/pickKeys'
import { Logger as EXLogger } from "@gobletqa/exam"
import { emptyObj } from "@keg-hub/jsutils/emptyObj"
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { writeFile, mkdir, copyFile } from 'node:fs/promises'
import { EUIReportType, ETestType, EBrowserType } from '@GSC/types'
import { buildBddEnvs } from '@gobletqa/test-utils/utils/buildBddEnvs'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'
import { buildTestArgs } from '@gobletqa/test-utils/utils/buildTestArgs'
import { TestsToSocketEvtMap, InternalPaths } from '@gobletqa/environment/constants'

import {
  getDefOpts,
  buildTempLoc,
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
  saveHtml?:boolean
  saveJson?:boolean
  runTimestamp:number
  eventSplit?:string=``
  events:TExamUIRunEvts = {}
  onEvent:TExamUIRunEvtCB[]=[]
  extraEvt:Partial<TExamEvtExtra>
  onRunFinish:TExamUIRunFinishCB[]=[]


  #ensureTempDir = async (type:EUIReportType) => {
    const tempJsonLoc = path.join(InternalPaths.reportsTempDir, type)
    await mkdir(tempJsonLoc, { recursive: true })
    
    return tempJsonLoc
  }

  #ensureRepoDir = async (subdir:string=`full`) => {
    const repoLoc = path.join(this.repo.paths.reportsDir, subdir)
    await mkdir(repoLoc, { recursive: true })

    return repoLoc
  }

  #generateHtml = async () => {
    return ``
  }

  #safeLogData = (data:string) => {
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
    data && EXLogger.stdout(data)
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
  }

  buildTestParams = (
    opts:TExamUIRun,
    cfg:TExamUIChildProcOpts,
  ) => {

    const cmdParams = pickKeys(cfg, [`env, stdio`, `detached`, `shell`, `gid`, `uid`])

    const params = buildBddEnvs({
      ...opts,
      // Default to headless true for now should be added on the frontend
      headless: true,
      cwd: aliases?.GobletRoot,
      browser: EBrowserType.chromium,
    }, EBrowserType.chromium, ETestType.feature, true)
    
    return deepMerge<SpawnOptionsWithoutStdio>(
      getDefOpts(),
      cmdParams,
      params
    )
  }

  constructor(props:TExamUIRunOpts) {
    this.repo = props.repo
    this.runTimestamp = props.runTimestamp

    this.runId = this.buildRunId()
    this.testRun = {files: {}, runId: this.runId}

    props.onEvent && this.onEvent.push(props.onEvent)
    props.onRunFinish && this.onRunFinish.push(props.onRunFinish)
    this.extraEvt = props.extraEvt ?? emptyObj
    props.eventSplit && (this.eventSplit = props.eventSplit)

  }

  /**
   * Run exams/tests from UI in a child process
   * Main entry point for test execution
   */
  runTests = (
    opts:TExamUIRun=emptyObj as TExamUIRun,
    cfg:TExamUIChildProcOpts=emptyObj,
  ) => {
    const testCmd = buildTestArgs(opts)
    const [cmd, ...args] = testCmd

    return runExam(cfg, cmd, args, this.buildTestParams(opts, cfg))
  }

  buildRunId = () => {
    return `${cleanRepoName(this.repo.name)}.${this.runTimestamp}`
  }

  saveTempJsonReport = async () => {
    const tempJsonLoc = await this.#ensureTempDir(EUIReportType.json)
    const loc = buildTempLoc(
      tempJsonLoc,
      this.runId,
      EUIReportType.json
    )

    Logger.pair(`Saving Exam UI Run events to`, loc)
    await writeFile(loc, JSON.stringify(this.events))
  }

  saveTempHtmlReport = async () => {
    const tempHtmlLoc = await this.#ensureTempDir(EUIReportType.html)
    const loc = buildTempLoc(
      tempHtmlLoc,
      this.runId,
      EUIReportType.html
    )

    const html = await this.#generateHtml()
    await writeFile(loc, html)
  }

  saveReportToRepo = async (tempLoc:string) => {
    const repoDir = await this.#ensureRepoDir(`full`)
    const repoLoc = path.join(repoDir, path.basename(tempLoc))

    await copyFile(tempLoc, repoLoc)
  }

  runFinish = async (args:TExamUIRunFinish) => {
    const {cb, code, extra} = args

    const event = formatTestEvt({} as TExTestEventMeta, {
      message: `Test Suite finished`,
      name: TestsToSocketEvtMap.ended,
      ...this.extraEvt,
      runId: this.runId,
      error: !Boolean(code),
      runTimestamp: this.runTimestamp,
    }) as TExTestEventMeta

    ;[cb, ...this.onRunFinish].forEach(cb => cb && cb?.(event, this.testRun))

    // Disabled for now because it's not being used
    // await this.saveTempJsonReport()
  }

  parseEvent = ({
    data,
    ref=this.eventSplit
  }:{ data:string, ref?:string }) => {
    const events:TExTestEventMeta[] = []
    if(!data.includes(ref)){
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

  cleanup = () => {
    this.repo = undefined
    this.events = {}
    this.events = undefined
    this.onEvent = []
    this.onEvent = undefined
  }

}
