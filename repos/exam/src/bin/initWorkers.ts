import type { TExamCliOpts, TExamConfig } from '@GEX/types'

import PQueue from 'p-queue'

import os from 'os'
import path from 'path'
import { ife } from '@keg-hub/jsutils'
import { loadFiles } from './loadFiles'
import { updateCLIEnvs } from './helpers'
import { WorkerPool } from '@GEX/workerPool'
import { logWorkBreakdown } from '@GEX/debug'
import { chunkify } from '@GEX/utils/chunkify'
import {ExamCfgModeType} from '@GEX/constants/constants'

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

const getWAndC = (exam:TExamConfig, locationsAmt:number) => {
  if(exam.runInBand) return { workers: 1, concurrency: 1 }

  const workers = getWorkerNum(exam.workers, locationsAmt)

  return {
    workers,
    concurrency: getConcurrency(exam.concurrency, Math.floor(locationsAmt / workers))
  }
}

export const initWorkers = async (
  exam:TExamConfig & { file?:string },
  opts:TExamCliOpts
) => {

  const locations = await loadFiles(exam)
  const locationsAmt = locations.length

  const {
    workers,
    concurrency,
  } = getWAndC(exam, locations.length)

  const chunks = exam.runInBand
    ? {[0]: locations}
    : chunkify<string>(locations, concurrency || 1)

  updateCLIEnvs(exam, opts)
  
  logWorkBreakdown(workers, concurrency, locationsAmt)

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

  return await Promise.all(Object.values(chunks).map(async (tests) => {
    return exam.mode === ExamCfgModeType.serial
      ? Promise.all(tests.map(async (test) => {
          return await WP.run({
            run: {
              cli: true,
              testMatch: [test]
            }
          })
        }))
      : Promise.all([ife(async () => {
          return await WP.run({
            run: {
              cli: true,
              testMatch: tests
            }
          })
        })])
  }))
  
  // TODO: Investigate why WP.close is throwing an error
  // It seems the last worker in always exiting with code 1
    // .then(async (resp) => {
    //   await WP.close()
    //   return resp
    // })

}
