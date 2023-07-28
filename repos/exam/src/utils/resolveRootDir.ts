import type { TExamConfig } from '@GEX/types'

import { ExamCfg } from '@GEX/constants'

export const resolveRootDir = (config:TExamConfig) => {
  return config.rootDir
    || process?.env?.EXAM_ROOT_DIR
    || process?.env?.GOBLET_MOUNT_ROOT
    || process?.env?.GOBLET_CONFIG_BASE
    || ExamCfg.rootDir
}
