import type { TExamConfig } from '@gobletqa/exam'

import { ENVS } from '@gobletqa/environment'

export type TGetTimeouts = {
  examConfig?:TExamConfig
  defs:{testTimeout:number, suiteTimeout:number},
}

/**
 * Normalize getting test and suite timeouts
 * Need to update other refs to use this method
 */
export const getExamTimeouts = (opts:TGetTimeouts) => {
  const {
    defs,
    examConfig,
  } = opts

  return {
    suiteTimeout: ENVS.GOBLET_SUITE_TIMEOUT
      ?? examConfig?.suiteTimeout
      ?? defs?.suiteTimeout,
    testTimeout: ENVS.GOBLET_TEST_TIMEOUT
      ?? examConfig?.testTimeout
      ?? defs?.testTimeout,
  }
}
