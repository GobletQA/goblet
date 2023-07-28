import type { TExamConfig } from '@GEX/types'

import os from 'os'
const cpuCount = os.cpus().length

export const logWorkBreakdown = (
  workers:number,
  concurrency:number,
  locationsAmt:number
) => {
  if(!process.env.EXAM_CLI_DEBUG) return

  console.log(`\n------- Worker Breakdown -------`)
  console.log(
    ` workers: ${workers}\n`,
    `  - out of ${cpuCount} total cores\n`,
    `concurrency: ${concurrency}\n`,
    `  - ${concurrency} file(s) per worker\n`,
    `files: ${locationsAmt}\n`,
    `  - total of ${locationsAmt} test file(s) will be executed\n`
  )
}

export const printDebugResults = (
  result:any[],
  time:number
) => {
  if(!process.env.EXAM_CLI_DEBUG) return
  
  console.log(`\n------- Execution Timing -------`)
  console.log(
    ` time: ${time}\n`,
    `  - total of ${time} time spent executing test file(s)\n`,
    `files: ${result.length}\n`,
    `  - total of ${result.length} test file(s) were executed\n`
  )
}
