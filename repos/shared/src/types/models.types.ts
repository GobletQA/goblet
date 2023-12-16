export type TGeneralAst = Record<any, any>

export type TFileModel = {
  name: string
  ext: string
  mime?: string
  uuid: string
  content: string
  location: string
  relative: string
  fileType: string
  ast: TGeneralAst,
  worldFile?:boolean
  gobletFile?:boolean
}


export type TTestsModel = {
  features: TFileModel[],
  definitions: TFileModel[],
  // What is this?
  jest: TFileModel[],
  unit: TFileModel[],
  waypoint: TFileModel[],
}

export type TRunCmdMessage = {
  [key:string]:  any
}

export type TTestRunModel = {
  file: string
  fileType: string
  lastRun: string
  exitCode: number | undefined,
  failed: boolean,
  active: boolean,
  running: boolean,
  command: string | undefined,
  params: string[],
  messages: Record<string, TRunCmdMessage>,
}
