import type { TProc } from '@GSC/types'

import { exec } from 'child_process'

/**
 * Parses the output of the search command
 * Assumes only a single running process could be found
 * @function
 * @private
 */
const parseOutput = (procName:string, output:string) => {
  const running = output.toLowerCase().includes(procName.toLowerCase())
  if (!running) return { running, name: procName }

  const [pid, tty, time, name] = output
    .trim()
    .split(' ')
    .filter(part => part)
  return {
    tty,
    time,
    running,
    name: name.replace('\n', ''),
    pid: parseInt(pid, 10),
  } as TProc
}


/**
 * Gets the command used to search for the process based on the platform
 * @function
 * @private
 */
const getPlatformCmd = (procName:string, platform:string) => {
  const proc = `"[${procName[0]}]${procName.substring(1)}"`
  switch (platform) {
    case 'linux':
    case 'darwin':
      return `ps -A | grep ${proc}`
    case 'win32':
      return `tasklist`
    default:
      return false
  }
}

/**
 * Searches for a currently process by name, and returns it if found
 * @function
 * @public
 */
export const findProc = (procName:string) => {
  return new Promise((res, rej) => {
    const platform = process.platform
    // Use the platform to know the correct search command
    const cmd = getPlatformCmd(procName, platform)
    if (!cmd) return rej(`Error: ${platform} platform not supported.`)

    // Run the search command, and compare the output
    exec(cmd, (err, stdout, stderr) => {
      if (err || stderr)
        return res({ running: false, name: procName, err: err?.message || stderr })

      // Finding the pid on windows machine not currently supported
      // I would need a windows OS to see the tasklist cmd output, to know how to parse it
      const status =
        platform === 'win32'
          ? {
              running: stdout.toLowerCase().includes(procName.toLowerCase()),
              name: procName,
            } as TProc
          : parseOutput(procName, stdout)

      res(status)
    })
  })
}
