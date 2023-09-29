import type { TExamConfig } from '@GEX/types'


import { loadFiles } from '@GEX/utils/loadFiles'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { timedRun } from '@keg-hub/jsutils/timedRun'
import { initPipeline } from '../pipelines/initPipeline'

type TInitExamCfg = TExamConfig & { file?:string }

export const initLocal = async (exam:TInitExamCfg) => {
  const locations = await loadFiles(exam)

  return await timedRun(initPipeline, {
    id: nanoid(),
    config: exam,
    testMatch: locations,
  })
}