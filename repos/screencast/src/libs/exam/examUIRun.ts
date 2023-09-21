import type { TExTestEventMeta } from "@gobletqa/exam"
import type {
  Repo,
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
  timestamp:string|number,
) => {
  const cleaned = cleanRepoName(name)
  return path.join(dir,  `${cleaned}.${timestamp}.${type}`)
}


export class ExamUIRun {
  repo:Repo
  saveHtml?:boolean
  saveJson?:boolean
  events:TExamUIRunEvts = {}
  onEvent:TExamUIRunEvtCB[]=[]
  onRunFinish:TExamUIRunFinishCB[]=[]

  constructor(props:TExamUIRunOpts) {
    this.repo = props.repo

    props.onEvent
      && this.onEvent.push(props.onEvent)
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

  saveTempJsonReport = async () => {
    const tempJsonLoc = await this.#ensureTempDir(EUIReportType.json)
    const loc = buildTempLoc(
      tempJsonLoc,
      this.repo.name,
      EUIReportType.json,
      new Date().getTime()
    )

    Logger.pair(`Saving Exam UI Run events to`, loc)
    await writeFile(loc, JSON.stringify(this.events))
  }

  saveTempHtmlReport = async () => {
    const tempHtmlLoc = await this.#ensureTempDir(EUIReportType.html)
    const loc = buildTempLoc(
      tempHtmlLoc,
      this.repo.name,
      EUIReportType.html,
      new Date().getTime()
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
    const {cb, code} = args

    ;[cb, ...this.onRunFinish].forEach(cb => cb && cb?.(finishedEvt, this.events))

    await this.saveTempJsonReport()
  }

  parseEvent = ({data, ref }:{ data:string, ref:string }) => {
    const events:TExTestEventMeta[] = []
    if(!data.includes(ref)) return events

    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = `1`
    data.split(ref)
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

  onEvtsParsed = ({events, extra, cb}:TParsedEvtOpts) => {

    events.forEach(evt => {
      const formatted = formatTestEvt(evt, extra) as TExTestEventMeta
      [cb, ...this.onEvent].forEach(cb => cb && cb?.(formatted))
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
