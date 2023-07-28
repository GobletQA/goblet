import type { TExamConfig } from '@GEX/types'

import os from 'os'
import path from 'path'
import PQueue from 'p-queue'
import { loadFiles } from './loadFiles'
import { WorkerPool } from '@GEX/workerPool'
import { chunkify } from '@GEX/utils/chunkify'


const cpuCount = os.cpus().length

const getWorkerNum = (workers?:number, locationsAmt:number=1) => {
  const oneLessCpus = cpuCount - 1
  const amount = workers > 0 ? workers : oneLessCpus > 0 ? oneLessCpus : 1

  // One create as many workers as we have files to be tested
  return amount > locationsAmt ? locationsAmt : amount
}

const getConcurrency = (concurrency?:number, evenSplit?:number) => {
  return concurrency > 0 ? concurrency : evenSplit > 0 ? evenSplit : 1
}

const resolveWorkerConcurrency = (exam:TExamConfig, locationsAmt:number) => {
  if(exam.runInBand) return { workers: 1, concurrency: 1 }

  const workers = getWorkerNum(exam.workers, locationsAmt)

  return {
    workers,
    concurrency: getConcurrency(exam.concurrency, Math.floor(locationsAmt / workers))
  }
}

const logWorkBreakdown = (workers:number, concurrency:number, locationsAmt:number) => {
  console.log(`------- Worker Breakdown -------`)
  console.log(
    ` workers: ${workers}\n`,
    `  - out of ${cpuCount} total cores\n`,
    `concurrency: ${concurrency}\n`,
    `  - ${concurrency} file(s) per worker\n`,
    `files: ${locationsAmt}\n`,
    `  - total of ${locationsAmt} test file(s) will be executed`
  )
}

export const initWorkers = async (exam:TExamConfig & { file?:string }) => {

  const locations = await loadFiles(exam)
  const locationsAmt = locations.length

  const {
    workers,
    concurrency,
  } = resolveWorkerConcurrency(exam, locations.length)


  const chunks = exam.runInBand
    ? locations
    : chunkify(locations, concurrency || 1)

  exam.debug
    && logWorkBreakdown(workers, concurrency, locationsAmt)


  const WP = new WorkerPool({
    size: workers,
    location: path.join(__dirname, `worker.js`),
    worker: {
      // Manage the workers process.env values
      env: {},
      // Initial data passed to teh worker
      workerData: { exam }
    }
  })

  const output = await Promise.all(chunks.map((tests) => WP.run({
    run: {
      cli: true,
      testMatch: tests
    }
  })))
  
  console.log(`------- output -------`)
  console.log(output)
}
