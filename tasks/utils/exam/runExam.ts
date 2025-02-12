import type { ETestType } from '@gobletqa/shared/enums'
import type {
  TTaskParams,
  TGobletConfig,
} from '../../types'

export type TRunExam = {
  config:string
  type: ETestType
  params:TTaskParams
  goblet: TGobletConfig
}


export const runExam = async (opts:TRunExam) => {
  const {
    type,
    params,
    goblet,
    config,
  } = opts

  return 1
}
