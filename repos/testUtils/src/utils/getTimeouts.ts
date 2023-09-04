import type { TGobletTestOpts } from '../types'
import type { TExamConfig } from '@gobletqa/exam'

export type TGetTimeouts = {
  examConfig?:TExamConfig
  defs:{testTimeout:number, suiteTimeout:number},
}

/**
 * Normalize getting test and suite timeouts
 * Need to update other refs to use this method
 */
export const getTimeouts = (opts:TGetTimeouts) => {
  const {
    defs,
    examConfig,
  } = opts

  return {
    suiteTimeout: examConfig?.suiteTimeout || defs?.suiteTimeout,
    testTimeout: examConfig?.testTimeout || defs?.testTimeout,
  }
}
