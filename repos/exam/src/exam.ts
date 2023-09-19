import type { TInitExamCfg, TInitExamOpts, TExRunResult } from '@GEX/types'

import { updateCLIEnvs } from './bin/helpers'
import { loadFiles } from '@GEX/utils/loadFiles'
import { nanoid } from '@keg-hub/jsutils/nanoid'
import { initPipeline } from './pipelines/initPipeline'


export const exam = async (
  cfg:TInitExamCfg,
  opts:TInitExamOpts,
  forceEnvs?:boolean
) => {
  const resetCLIEnvs = updateCLIEnvs(cfg, opts, forceEnvs)
  const locations = await loadFiles(cfg)

  let error:Error
  let result:TExRunResult[]

  try {
    result = await initPipeline({
      config: cfg,
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
