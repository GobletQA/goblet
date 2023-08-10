import type { TExamConfig } from '@GEX/types'

import { ExamCfg } from '@GEX/constants'
import { ENVS } from '@gobletqa/environment'

export const resolveRootDir = (config:TExamConfig) => {
  // TODO: use the CLI getRoot method
  // Need to move those helper method to the exam/utils directory
  return config.rootDir
    || process?.env?.EXAM_ROOT_DIR
    || ENVS.GOBLET_MOUNT_ROOT
    || ENVS.GOBLET_CONFIG_BASE
    || ExamCfg.rootDir
}
