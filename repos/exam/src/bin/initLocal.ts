import type { TExamCliOpts, TExamConfig } from '@GEX/types'

import path from 'path'
import { loadFiles } from './loadFiles'
import { splitWork } from './splitWork'
import { nanoid } from '@GEX/utils/nanoid'
import { WorkerPool } from '@GEX/workerPool'
import { logWorkBreakdown } from '@GEX/debug'
import { RunPipeline } from '../pipelines'

export const initLocal = async (exam:TExamConfig & { file?:string }, opts:TExamCliOpts) => {
  const locations = await loadFiles(exam)

  const setup = await RunPipeline({
    reverse: [],
    config: exam,
    id: nanoid(),
    tests: locations,
  })

      // cli: true,
      // testMatch: [jobs[job]]
}