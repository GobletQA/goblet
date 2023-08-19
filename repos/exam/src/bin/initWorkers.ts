import type { TExamCliOpts, TExamConfig } from '@GEX/types'

import path from 'path'
import { loadFiles } from './loadFiles'
import { splitWork } from './splitWork'
import { runWorkers } from './runWorkers'
import { WorkerPool } from '@GEX/workerPool'
import { logWorkBreakdown } from '@GEX/debug'
import { timedRun } from '@keg-hub/jsutils/timedRun'

export const initWorkers = async (exam:TExamConfig & { file?:string }, opts:TExamCliOpts) => {
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

  return await timedRun(
    runWorkers,
    WP,
    exam,
    chunks
  )

}
