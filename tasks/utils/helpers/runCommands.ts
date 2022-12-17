import type { TTaskParams } from '../../types'
import { runSeq } from '@keg-hub/jsutils'

type TCmdFunc = (...args:any[]) => any

/**
 * Run each command in sequence or all at the same time
 * @param {Array<function>} commands - Group of command functions to run
 * 
 * @returns {Array<number>} - Exit code of each command run
 */
export const runCommands = async (
  commands:TCmdFunc[],
  params:TTaskParams
) => {
  const { concurrent } = params
  return concurrent
    ? await Promise.all(commands.map(async cmd => cmd())) 
    : await runSeq(commands)
}
