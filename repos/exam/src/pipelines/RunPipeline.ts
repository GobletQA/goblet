import type { TExamConfig } from '@GEX/types'
import pPipe from 'p-pipe'

type TRunPipeline = {
  id:string
  exam:TExamConfig
}

export const RunPipeline = async (args:TRunPipeline) => {
  return []
}