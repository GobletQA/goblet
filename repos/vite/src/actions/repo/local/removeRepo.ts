import { repoDispatch } from '@reducers'
import { localStorage } from '@services/localStorage'
import { clearFileTree } from '@actions/files/local/clearFileTree'
import { clearFeatures } from '@actions/features/local/clearFeatures'
import { clearActiveFile } from '@actions/files/local/clearActiveFile'
import { clearPendingFiles } from '@actions/files/local/clearPendingFiles'
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

  tryAction(repoDispatch.clear, 'repoDispatch.clear')
  tryAction(clearFeatures, `clearFeatures`)
  tryAction(clearDefinitions, `clearDefinitions`)
  tryAction(clearFileTree, `clearFileTree`)
  tryAction(clearActiveFile, `clearActiveFile`)
  tryAction(clearPendingFiles, `clearPendingFiles`)

  await localStorage.removeRepo()
}