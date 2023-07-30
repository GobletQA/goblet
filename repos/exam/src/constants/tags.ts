import { Logger } from '@GEX/utils/logger'

export const ExamTag = Logger.colors.yellow(`[Exam Event]`)
export const EvtTag = (name:string) => Logger.colors.cyan(`[${name}]`)
export const WkrPoolTag = Logger.colors.yellow(`[WKR-POOL]`)

export const FileTag = Logger.colors.cyan(`File`)
export const SuiteTag = (msg:string) => Logger.colors.magenta(msg)
export const RootSuiteTag = (msg:string) => Logger.colors.yellow(msg)