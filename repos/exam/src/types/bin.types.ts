import { TExamConfig } from './exam.types'

export type TExamCliOpts = Omit<TExamConfig, `onEvent`|`onCancel`|`onCleanup`> & {
  config?: string
  serial?:boolean
  parallel?:boolean
}

