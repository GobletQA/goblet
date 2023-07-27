import type {Exam} from "@GEX/Exam"
import type {Context, RunningCodeOptions} from "vm"

export interface IVMContext {
  exam:Exam
  require?:NodeRequire
  globals?: Context | undefined
}

export type TModGlobals = {
  module: NodeJS.Module
  require: NodeJS.Require
  exports: NodeJS.Module[`exports`]
  __dirname: NodeJS.Module[`path`]
  __filename: NodeJS.Module[`filename`]
}


export type TVMRequireOpts = RunningCodeOptions & {
  global?:boolean
}