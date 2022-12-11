// TODO: Figure out a way to load a parkin instance relative to a repo
// This is needed when loading definitions from the backend API
// The Repo instance holds an instance of Parkin that needs to be used here instead of creating one
// Need to figure out a way to override the instance here, and use the Repos Parkin instance
import { Parkin } from '@ltipton/parkin'
import { getWorld } from '@GSH/repo/world'

let __ParkinInstance

// Sets a new instance of the Parkin Class to the __ParkinInstance variable
// Currently not called anywhere
export const setParkinInstance = (instance) => {
  if(instance && instance !== __ParkinInstance) __ParkinInstance = instance

  __ParkinInstance = __ParkinInstance || new Parkin(getWorld())

  return __ParkinInstance
}

export const getParkinInstance = (repo) => {
  __ParkinInstance = __ParkinInstance || new Parkin(getWorld(repo))

  return __ParkinInstance
}

