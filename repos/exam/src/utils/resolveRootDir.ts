import type { TExamConfig } from '@GEX/types'

import { ExamCfg } from '@GEX/constants'
import { ENVS } from '@gobletqa/environment'

export const resolveRootDir = (config:TExamConfig) => {
  return config.rootDir
    || process?.env?.EXAM_ROOT_DIR
    || ENVS.GOBLET_MOUNT_ROOT
    || ENVS.GOBLET_CONFIG_BASE
    || ExamCfg.rootDir
}
