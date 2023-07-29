import type { TExamConfig } from '@GEX/types'

import os from 'os'
import util from 'util'
import { Logger } from '@GEX/utils/logger'
import { exists } from '@keg-hub/jsutils'

const clr = Logger.colors

/**
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  crimson,

  reset,
  bright,
  dim,
  underline,
  blink,
  reverse,
  hidden,

 */

const cpuCount = exists(process.env.JEST_WORKER_ID) ? 2 : os.cpus().length

const header = (title:string) => {
  console.log(` ${clr.cyan(title)}`)
}

const item = (key:any, value:any) => {
  const sp = ``
  console.log(sp, ` * ${clr.gray(key)}`, clr.white(value))
}

const logState = () => {
  return {
    debug: process.env.EXAM_CLI_DEBUG,
    verbose: process.env.EXAM_CLI_VERBOSE,
  }
}

export const logWorkBreakdown = (
  workers:number,
  concurrency:number,
  locationsAmt:number
) => {

  const state = logState()
  if(!state.verbose) return

  header(`Worker Breakdown`)
  item(`Workers:`, `${workers} of ${cpuCount} total`)
  item(`Concurrency:`, `${concurrency} file(s) per worker`)
  item(`Files:`, `${locationsAmt} test file(s) to execute`)
}

export const printDebugResults = (
  result:any[],
  time:number
) => {
  if(!process.env.EXAM_CLI_VERBOSE) return

  const seconds = (time/1000).toFixed(2)

  header(`Execution Timing`)
  item(`Time:`, `total of ${seconds} seconds spent executing test file(s)`)
  item(`Files:`, `total of ${result.length} test file(s) were executed`)

}

export const printJsonResults = (results:Record<any, any>) => {
  if(!process.env.EXAM_CLI_VERBOSE) return

  header(`Test File Results`)
  console.log(util.inspect(JSON.parse(JSON.stringify(results)), {
    depth: null,
    colors: true,
    showHidden: false,
  }))
}

export const printTooManyWorkers = (amount:number, oneLessCpus:number) => {
  if(!process.env.EXAM_CLI_VERBOSE) return

  Logger.log([
    Logger.colors.yellow(`Attempting to use more workers (${amount}) then available ${cpuCount}`,)
    `  - Defaulting to using default (${oneLessCpus}) instead`,
    `  - Please update your configuration`,
  ].join(`\n`))
}