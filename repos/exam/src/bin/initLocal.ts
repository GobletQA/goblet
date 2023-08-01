import type { TExamCliOpts, TExamConfig } from '@GEX/types'

import { loadFiles } from './loadFiles'
import { nanoid } from '@GEX/utils/nanoid'
import { timedRun } from '@keg-hub/jsutils'
import { RunPipeline } from '../pipelines'


export const initLocal = async (exam:TExamConfig & { file?:string }, opts:TExamCliOpts) => {
  const locations = await loadFiles(exam)

  return await timedRun(RunPipeline, {
    id: nanoid(),
    config: exam,
    testMatch: locations,
  })
}