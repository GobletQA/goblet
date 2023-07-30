import { Logger } from '@GEX/utils/logger'

export const ExamTag = Logger.colors.yellow(`[Exam Event]`)
export const EvtTag = (name:string) => Logger.colors.cyan(`[${name}]`)
export const WkrPoolTag = Logger.colors.yellow(`[WKR-POOL]`)

export const SpecTag = (msg:string) => Logger.colors.cyan(`[${msg}]`)
export const SuiteTag = (msg:string) => Logger.colors.magenta(msg)
export const RootSuiteTag = (msg:string) => Logger.colors.yellow(msg)