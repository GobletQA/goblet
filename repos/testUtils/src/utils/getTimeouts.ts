import type { TGobletTestOpts } from '../types'
import type { TExamConfig } from '@gobletqa/exam'

export type TGetTimeouts = {
  gobletOpts:TGobletTestOpts
  examConfig?:TExamConfig
  defs:{timeout:number, globalTimeout:number},
}

/**
 * Normalize getting test timeouts
 * Need to update other refs to use this method
 */
export const getTimeouts = (opts:TGetTimeouts) => {
  const {
    defs,
    gobletOpts,
    examConfig,
  } = opts

  return {
    globalTimeout: examConfig?.globalTimeout || defs?.globalTimeout,
    timeout: gobletOpts?.timeout || examConfig?.timeout || defs?.timeout,
  }
}
