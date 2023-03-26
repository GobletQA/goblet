import { repoDispatch } from '@store'
import { localStorage } from '@services/localStorage'
import { clearFileTree } from '@actions/files/local/clearFileTree'
import { clearDefinitions } from '@actions/definitions/local/clearDefinitions'

export type TActionFunc = (...args:any[]) => void

const tryAction = (action:TActionFunc, name:string, ...args:any[]) => {
  try {
    action(...args)
  }
  catch (err: any) {
    console.warn(`Error calling ${name} in "removeRepo" action`)
    console.warn(err.message)
  }
}

/**
 * Removes the currently loaded repo from the store and local StorageKeys
 * Also cleans out the store's features, definitions and file tree
 */
export const removeRepo = async () => {

  tryAction(repoDispatch.clearRepo, `repoDispatch.clearRepo`)
  tryAction(clearDefinitions, `clearDefinitions`)
  tryAction(clearFileTree, `clearFileTree`)

  await localStorage.removeRepo()
}
