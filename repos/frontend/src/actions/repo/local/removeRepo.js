import { setItems } from 'GBActions'
import { Values } from 'GBConstants'
import { localStorage } from 'GBUtils/storage/localStorage'
import { clearFileTree } from 'GBActions/files/local/clearFileTree'
import { clearFeatures } from 'GBActions/features/local/clearFeatures'
import { clearActiveFile } from 'GBActions/files/local/clearActiveFile'
import { clearPendingFiles } from 'GBActions/files/local/clearPendingFiles'
import { clearDefinitions } from 'GBActions/definitions/local/clearDefinitions'

const { STORAGE } = Values

const tryAction = (action, name, ...args) => {
  try {
    action(...args)
  }
  catch (err) {
    console.warn(`Error calling ${name} in "removeRepo" action`)
    console.warn(err.message)
  }
}

/**
 * Removes the currently loaded repo from the store and local storage
 * Also cleans out the store's features, definitions and file tree
 */
export const removeRepo = async () => {
  
  tryAction(setItems, 'setItems', STORAGE.REPO, {})
  tryAction(clearFeatures, `clearFeatures`)
  tryAction(clearDefinitions, 'clearDefinitions')
  tryAction(clearFileTree, 'clearFileTree')
  tryAction(clearActiveFile, 'clearActiveFile')
  tryAction(clearPendingFiles, 'clearPendingFiles')

  await localStorage.removeRepo()
}
