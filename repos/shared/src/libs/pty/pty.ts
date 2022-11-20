
import os from 'os'
import { deepMerge } from '@keg-hub/jsutils'
import { create as childProc }from '@keg-hub/spawn-cmd/src/childProcess'

export type TShell = `powershell.exe`|`bash` | `sh`

export type IPtyForkOptions = {
  cwd: string
  gid: string
  uid: string
  stdio: string|string[]|number[]
  onStdOut: (data:string, procId:number) => any,
  onStdErr: (err:string, procId:number) => any,
  onError: (err:string, procId:number) => any,
  onExit: (exitCode:number, procId:number) => any,
  [key:string]: any
}

export type TPty = IPtyForkOptions & {
  shell:TShell
}

class PTY {
  shell: TShell
  process: TPty

  constructor(config:TPty) {
    const {
      shell,
      ...ptyOpts
    } = config

    this.shell = shell || os.platform() === `win32` ? `powershell.exe` : `bash`
    this.start(ptyOpts)
  }

  start = (opts:IPtyForkOptions) => {
    this.process = childProc({
      log: true,
      cmd: this.shell,
      args: [],
      options: deepMerge(opts, {
        cwd: process.env.HOME,
        stdio: opts.stdio || 'inherit',
        env: { ...process.env, ...opts.env },
      }),
    })
  }

  write = (data:string) => this.process.write(data)
}

module.exports = PTY
