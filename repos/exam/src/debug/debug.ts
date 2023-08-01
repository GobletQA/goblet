
import util from 'util'
import { Logger } from '@GEX/utils/logger'
import { emptyArr } from '@keg-hub/jsutils'
import { getCPUCount } from '@GEX/utils/getCPUCount'

const clr = Logger.colors

const header = (title:string) => {
  Logger.debug(` ${clr.cyan(title)}`)
}

const item = (key:any, value:any) => {
  const sp = ``
  Logger.debug(sp, ` * ${clr.gray(key)}`, clr.white(value))
}

export const logWorkBreakdown = (
  workers:number,
  concurrency:number,
  locationsAmt:number
) => {

  Logger.empty()
  header(`Worker Breakdown`)
  item(`Workers:`, `${workers} of ${getCPUCount()} total`)
  item(`Concurrency:`, `${concurrency} file(s) per worker`)
  item(`Files:`, `${locationsAmt} test file(s) to execute`)
}

export const printDebugResults = (
  result:any[]=emptyArr,
  time:number
) => {
  const seconds = (time/1000).toFixed(2)
  Logger.empty()
  header(`Execution Timing`)
  item(`Time:`, `${seconds} seconds`)
  item(`Files:`, `${result?.length || 0} test file(s) were executed`)
}

export const printTooManyWorkers = (amount:number, oneLessCpus:number) => {
  Logger.debug([
    Logger.colors.yellow(`Attempting to use more workers (${amount}) then available ${getCPUCount()}`),
    `  - Defaulting to using default (${oneLessCpus}) instead`,
    `  - Please update your configuration`,
  ].join(`\n`))
}

export const debugDeepObj = (obj:any) => {
  console.log(util.inspect(obj, {showHidden: false, depth: null, colors: true}))
}
