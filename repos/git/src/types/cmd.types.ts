
export type TRunCmdOpts = {
  cwd?: string
  exec?: boolean
  env?: Record<string, string|number|boolean>
  envs?: Record<string, string|number|boolean>
}

export type TRunCmd = (
  cmd:string,
  cmdArgs:string[],
  opts?:TRunCmdOpts,
  exec?:boolean,
  cwd?:string
) => Promise<TCmdResp>

export type TCmdResp = {
  data: string
  error: string
  exitCode: number
}

export type TLimboCmdResp = [err:Error, output:TCmdResp]