import type { TExamCliOpts, TExamConfig, TRunResult } from '@GEX/types'

import { updateCLIEnvs } from './bin/helpers'
import { loadFiles } from '@GEX/utils/loadFiles'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { initPipeline } from './pipelines/initPipeline'

export type TInitExamCfg = TExamConfig & { file?:string }
export type TInitExamOpts = TExamCliOpts & { id?:string }


export const exam = async (
  cfg:TInitExamCfg,
  opts:TInitExamOpts,
  forceEnvs?:boolean
) => {
  const resetCLIEnvs = updateCLIEnvs(exam, opts, forceEnvs)
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
