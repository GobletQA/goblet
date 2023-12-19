import type { TExamConfig } from '@GEX/types'


import {ExamError} from '@GEX/utils/error'
import { WorkerPool } from '@GEX/workerPool'
import { limbo } from '@keg-hub/jsutils/limbo'
import { flatArr } from '@keg-hub/jsutils/flatArr'
import {printExamTestMode} from '@GEX/debug/verbose'
import {ExamCfgModeType} from '@gobletqa/environment/constants'

/**
 * If there are
 *  - `9 jobs`
 *  - `3 workers`
 *  - `concurrency === 3`
 *  - `mode === serial`
 *
 * All `3 workers` will begin processing `jobs` as follows
 * - Each `worker` will process only `1 job` at a time, i.e. `3 workers` === `3 jobs` being proceeded
 * - When a `job` is finished, the next `job` in it's queue will be started
 * - This continues until no `jobs` are left in it's queue
 */


/**
 * Runs one job at a time
 * Returns a promise that resolves once all jobs are finished
 */
const runInSerial = async (
  WP:WorkerPool,
  jobs:string[]
) => {
  const responses = []

  return new Promise(async (res, rej) => {
    /** 
      * Run a job and wait for it to finish
      * Then continue on to the next job
      * Ensures we are running the jobs in serial
    */
    for(let job in jobs){

      /**
      * All jobs errors are captured and returned
      * We don't kill job execution if on of the jobs fails
      */
      const [__, result] = await limbo(WP.run({
        run: {
          cli: true,
          testMatch: [jobs[job]]
        }
      }))

      result && responses.push(...result)
    }

    res(responses)
  })
}

const runInParallel = async (
  WP:WorkerPool,
  jobs:string[]
) => {
  const responses = []
  const outcomes = await Promise.all(
    jobs.map((job) => {
      return WP.run({
        run: {
          cli: true,
          testMatch: [job]
        }
      })
    })
  )

  responses.push(...outcomes)

  return flatArr(responses)
}

export const runWorkers = async (
  WP:WorkerPool,
  exam:TExamConfig,
  chunks:Record<string | number, string[]>,
) => {
  /**
   * Run all the jobs within the workers
   */
  const [err, results] = await limbo(Promise.all(
    Object.values(chunks)
      .map(jobs => {
        printExamTestMode(exam.mode)

        return exam.mode === ExamCfgModeType.serial
          ? runInSerial(WP, jobs)
          : runInParallel(WP, jobs)
      })
  ))

  /**
   * Figure out how to handle errors from the Workers running Jobs
   */
  if(err) throw new ExamError(err, `cli.runWorkers`)

  /**
   * Shutdown the workers after the all jobs finish
   * TODO: Figure out how to handle shutdown errors?
  */
  const [shutDownErr] = await limbo(WP.close())
  shutDownErr && console.error(shutDownErr.message)

  return results
}
