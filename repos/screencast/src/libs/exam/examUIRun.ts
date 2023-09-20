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
import { limbo } from '@keg-hub/jsutils/limbo'
import { writeFile, readFile } from 'node:fs/promises'
import { PWPlay, InternalPaths } from '@gobletqa/environment/constants'
import { formatTestEvt } from '@GSC/libs/websocket/utils/formatTestEvt'

const finishedEvt = {
  name: PWPlay.playEnded,
  message: `Test Suite finished`,
}

const buildTempLoc = (name?:string, type?:`json`|`html`) => {
  
  path.join(InternalPaths.reportsTempDir)
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
  
  saveTempJsonReport = async () => {
    InternalPaths.reportsTempDir

  }

  saveTempHtmlReport = async () => {
    InternalPaths
    
    
  }

  saveJsonReportToRepo = async () => {
    InternalPaths
    
    
  }

  saveHtmlReportToRepo = async () => {
    const reportsTemp = InternalPaths.reportsTempDir
    
    
  }

  runFinish = (args:TExamUIRunFinish) => {
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined

    const {
      cb,
      code,
    } = args

    ;[cb, ...this.onRunFinish].forEach(cb => cb && cb?.(finishedEvt, this.events))


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
    ENVS.GB_LOGGER_FORCE_DISABLE_SAFE = undefined

    this.repo = undefined
    this.events = {}
    this.events = undefined
    this.onEvent = []
    this.onEvent = undefined
  }

}
