import type { Repo } from '@gobletqa/repo'
import type { TBrowserConf, TPWComponents } from './shared.types'


export type TJokerActExt = {
  repo?:Repo
  browserConf?:TBrowserConf
  pwComponents?:TPWComponents
}