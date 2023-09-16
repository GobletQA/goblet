import type { TExamCliOpts, TExamConfig, TRunResult } from '@GEX/types'

import { loadFiles } from '@GEX/utils/loadFiles'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { initPipeline } from './pipelines/initPipeline'
import { updateCLIEnvs } from './bin/helpers'

export type TInitExamCfg = TExamConfig & { file?:string }
export type TInitExamOpts = TExamCliOpts & { id?:string }


export const exam = async (cfg:TInitExamCfg, opts:TInitExamOpts) => {
  const resetCLIEnvs = updateCLIEnvs(exam, opts, true)
  const locations = await loadFiles(cfg)

  let error:Error
  let result:TRunResult[]

  try {
    result = await initPipeline({
      config: exam,
      testMatch: locations,
      id: opts?.id || nanoid(),
    })
  }
  catch(err){
    error = err
  }
  finally {
    resetCLIEnvs()
  }

  if(error) throw error

  return result
}
