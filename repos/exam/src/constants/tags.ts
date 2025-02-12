import { Logger } from '@GEX/utils/logger'

export const PipelineTag = `[PIPELINE]`
export const FileTag = Logger.colors.cyan(`File`)
export const ExamTag = Logger.colors.yellow(`[Exam Event]`)
export const ExamErrTag = Logger.colors.red(`[Exam Failed]`)
export const WkrPoolTag = Logger.colors.yellow(`[WKR-POOL]`)
export const WkrPoolErrTag = Logger.colors.red(`[WKR-POOL ERR]`)

export const SuiteTag = (msg:string) => Logger.colors.magenta(msg)
export const RootSuiteTag = (msg:string) => Logger.colors.yellow(msg)
export const EvtTag = (name:string) => Logger.colors.cyan(`[${name}]`)
