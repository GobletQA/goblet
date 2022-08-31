
export type TParamValue = any
export type TTaskParams = {
  env: string
  [key: string]: TParamValue
}

export type TTaskOptionType = 'string'
  | 'str'
  | 'number'
  | 'num'
  | 'boolean'
  | 'bool'
  | 'array'
  | 'arr'
  | 'object'
  | 'obj'

export type TTaskOption = {
  env?: string
  alias?: string[]
  example?: string
  description?: string
  default: TParamValue
  type: TTaskOptionType
}

export type TTaskOptions = Record<string, TTaskOption>

export type TTaskActionArgs = {
  task: TTask
  tasks: TTasks
  options?: string[]
  params: TTaskParams
  config?: Record<string, any>
}

export type TTaskAction = (args:TTaskActionArgs) => any

export type TTask = {
  name: string,
  alias?: string[]
  action?: TTaskAction
  options?: TTaskOption
  tasks?: TTasks
  [key: string]: any
}

export type TTasks = Record<string, TTask>