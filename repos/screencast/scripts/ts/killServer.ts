import type { TProc } from '@GSC/types'
import { iife } from '@keg-hub/jsutils/iife'
import { limbo } from '@keg-hub/jsutils/limbo'
import { findProc } from '@gobletqa/shared/utils'


const parseOutput = (procName:string, stdout:string) => {
  const found = stdout.split(`\n`).reduce((proc, line) => {
    if(!line.toLowerCase().includes(procName.toLowerCase())) return

    console.log(`------- line -------`)
    console.log(line)

    return proc
  }, {} as TProc)

  // {
  //   tty,
  //   time,
  //   running,
  //   name: name.replace('\n', ''),
  //   pid: parseInt(pid, 10),
  // } as TProc

  // const running = output.toLowerCase().includes(procName.toLowerCase())
  
  
}

/**
 * Gets the status of the tiger vnc server
 *
 * @returns {Object} - Status of the tiger vnc process
 */
export const statusScreencast = async () => {
  return console.log(`NOT IMPLEMENTED`)
  
  const [_, status] = await limbo<TProc>(findProc(
    `screencast`,
    `ps aux`,
    parseOutput
  ))
  return status
}

/**
 * Stops the screencast server if it's running
 * If no reference exists, calls findProc to get a reference to the PID
 *
 * @return {Void}
 */
export const stopScreencast = async () => {
  const status = await statusScreencast()
  // console.log(`------- status -------`)
  // console.log(status)
  
  // killProc(status)
}

iife(async () => {
  await stopScreencast()
})