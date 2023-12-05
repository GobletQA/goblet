export * from '../../../shared/src/types'

// TODO: fix this import path. Should ref an alias path, not a relative path
import type { TFileTypes } from '../../../shared/src/types/files.types'
import type { TExamConfig } from '../../../shared/src/types/exam.types'
import type { TGBWorldCfg } from '../../../shared/src/types/parkin.types'
import type { TGobletConfig } from '../../../shared/src/types/goblet.types'
import type { TGobletPWConfig } from '../../../shared/src/types/configs.types'
import type { TGScreencastConfig } from '../../../shared/src/types/screencast.types'


export {
  TFileTypes,
  TExamConfig,
  TGBWorldCfg,
  TGobletConfig,
  TGobletPWConfig,
  TGScreencastConfig
}