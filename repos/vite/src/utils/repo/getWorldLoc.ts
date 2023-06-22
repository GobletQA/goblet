import type { TRepoState } from '@types'

import { getStore } from '@store'
import {getRootPrefix} from './getRootPrefix'

export const getWorldLoc = (repo?:TRepoState) => {
  repo = repo || getStore().getState().repo
  const rootLoc = getRootPrefix(repo)
  const worldPath = repo?.paths?.world

  return `${rootLoc}/${worldPath}`
}