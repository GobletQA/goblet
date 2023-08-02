import type { TRepo } from '../types'

// TODO: Figure out a way to load a parkin instance relative to a repo
// This is needed when loading definitions from the backend API
// The Repo instance holds an instance of Parkin that needs to be used here instead of creating one
// Need to figure out a way to override the instance here, and use the Repos Parkin instance
import { Parkin } from '@ltipton/parkin'
import { getWorld } from '../../../workflows/src/repo/world'

let __ParkinInstance


export const getParkinInstance = (repo?:TRepo) => {
  __ParkinInstance = __ParkinInstance || new Parkin(getWorld(repo))

  return __ParkinInstance
}