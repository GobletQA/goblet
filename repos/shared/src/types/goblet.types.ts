import type { Repo } from './repo.types'
import type { TDefGobletConfig } from '../../../goblet/src/types'

export type {
  TDefGobletConfig
}

export type TGobletConfig = Repo|TDefGobletConfig
