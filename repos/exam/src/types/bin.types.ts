import { TExamConfig } from './exam.types'

export type TExamCliOpts = TExamConfig & {
  config?: string
  serial?:boolean
  parallel?:boolean
}

