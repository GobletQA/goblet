import type { TExamCliOpts, TExamConfig } from '@GEX/types'

import path from 'path'
import { ife } from '@keg-hub/jsutils'
import { loadFiles } from './loadFiles'
import { splitWork } from './splitWork'
import { WorkerPool } from '@GEX/workerPool'
import { logWorkBreakdown } from '@GEX/debug'
import {ExamCfgModeType} from '@GEX/constants/constants'


export const initWorkers = async (
  exam:TExamConfig & { file?:string },
  opts:TExamCliOpts
) => {

  const locations = await loadFiles(exam)

  const {
    total,
    chunks,
    workers,
    concurrency,
  } = splitWork(exam, locations)

  logWorkBreakdown(workers, concurrency, total)

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
