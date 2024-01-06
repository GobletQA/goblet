// import type { Repo } from '@gobletqa/repo'
import type { TBrowserConf, TPWComponents } from './shared.types'


export type TJokerActExt = {
  repo?:Record<string, any>
  browserConf?:TBrowserConf
  pwComponents?:TPWComponents
}
