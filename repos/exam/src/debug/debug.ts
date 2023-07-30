
import util from 'util'
import { Logger } from '@GEX/utils/logger'
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

  header(`Worker Breakdown`)
  item(`Workers:`, `${workers} of ${getCPUCount()} total`)
  item(`Concurrency:`, `${concurrency} file(s) per worker`)
  item(`Files:`, `${locationsAmt} test file(s) to execute`)
}

export const printDebugResults = (
  result:any[],
  time:number
) => {
  
  const seconds = (time/1000).toFixed(2)
  header(`Execution Timing`)
  item(`Time:`, `total of ${seconds} seconds spent executing test file(s)`)
  item(`Files:`, `total of ${result.length} test file(s) were executed`)
}

export const printTooManyWorkers = (amount:number, oneLessCpus:number) => {
  Logger.debug([
    Logger.colors.yellow(`Attempting to use more workers (${amount}) then available ${getCPUCount()}`),
    `  - Defaulting to using default (${oneLessCpus}) instead`,
    `  - Please update your configuration`,
  ].join(`\n`))
}

export const debugDeepObj = (obj:any) => {
  const json = util.inspect(JSON.parse(JSON.stringify(obj)))
  console.log(json, {
    depth: null,
    colors: true,
    showHidden: false,
  })
}
