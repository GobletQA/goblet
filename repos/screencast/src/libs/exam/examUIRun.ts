import type { TExTestEventMeta } from "@gobletqa/exam"
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
import { Logger } from '@GSC/utils/logger'
import { ENVS } from '@gobletqa/environment'
import {isArr} from '@keg-hub/jsutils/isArr'
import { emptyObj } from "@keg-hub/jsutils/emptyObj"
import { writeFile, readFile, mkdir, copyFile } from 'node:fs/promises'
import { PWPlay, InternalPaths } from '@gobletqa/environment/constants'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'


const finishedEvt = {
  name: PWPlay.playEnded,
  message: `Test Suite finished`,
}

enum EUIReportType {
  json=`json`,
  html=`html`
}

const cleanRepoName = (name:string) => {
  return name.replace(/[!@#$%^&*()_\\=+?:;"'<>,.{}|\/\[\]]/g, ` `)
    .trim()
    .replace(/\s/g, `-`)
    .toLowerCase()
}

const buildTempLoc = (
  dir:string,
  name:string,
  type:EUIReportType,
) => {
  return path.join(dir, `${name}.${type}`)
}

const safeLogData = (data:string) => {
  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined
  data && Logger.stdout(data)
  ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
}


export class ExamUIRun {
  repo:Repo
  runId:string
  saveHtml?:boolean
  saveJson?:boolean
  runTimestamp:number
  eventSplit?:string=``
  events:TExamUIRunEvts = {}
  onEvent:TExamUIRunEvtCB[]=[]
  extraEvt:Partial<TExamEvtExtra>
  onRunFinish:TExamUIRunFinishCB[]=[]

  constructor(props:TExamUIRunOpts) {
    this.repo = props.repo
    this.runTimestamp = props.runTimestamp

    this.runId = this.buildRunId()
    props.onEvent && this.onEvent.push(props.onEvent)
    props.onRunFinish && this.onRunFinish.push(props.onRunFinish)
    this.extraEvt = props.extraEvt ?? emptyObj
    props.eventSplit && (this.eventSplit = props.eventSplit)
  }

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

    const event = formatTestEvt(finishedEvt, {
      ...this.extraEvt,
      ...extra,
      runId: this.runId,
      runTimestamp: this.runTimestamp,
    }) as TExTestEventMeta

    ;[cb, ...this.onRunFinish].forEach(cb => cb && cb?.(event, this.events))

    await this.saveTempJsonReport()
  }

  parseEvent = ({
    data,
    ref=this.eventSplit
  }:{ data:string, ref?:string }) => {
    const events:TExTestEventMeta[] = []
    if(!data.includes(ref)){
      safeLogData(data)
      return events
    }

    data.split(ref)
      .forEach((evt:string) => {
        const cleaned = evt.trim()
        if(!cleaned) return

        try { events.push(JSON.parse(evt)) }
        catch(err){ safeLogData(evt) }
      })

    return events
  }

  onEvtsParsed = ({events, extra, cb}:TParsedEvtOpts) => {

    events.forEach(evt => {
      const formatted = formatTestEvt(evt, {
        ...this.extraEvt,
        ...extra,
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
