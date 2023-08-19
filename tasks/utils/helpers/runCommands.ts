import type { TTaskParams } from '../../types'

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
  return commands.reduce(async(acc, cmd) => {
    const codes = await acc
    const hasError = codes.find(code => code > 0)
    if(hasError) return codes

    const resp = await cmd() as number
    codes.push(resp)

    return codes
  }, Promise.resolve([] as number[]))
}
