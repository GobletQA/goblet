import { TExamConfig } from './exam.types'

export type TExamCliOpts = TExamConfig & {
  env?:string
  config?: string
  serial?:boolean
  parallel?:boolean
}

