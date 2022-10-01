import { TFileModel } from '@types'
import { saveFile } from '../api/saveFile'
import { setActiveFileFromType } from './setActiveFileFromType'


/**
 * Helper to save the file and updates the activeFile and file store
 * @param {string} content - text content of the file
 * @param {object} activeFile - fileModel object of the file with pending content
 *
 * @returns {boolean} - True if save was successful
 */
export const savePendingContent = async (content:string, activeFile:TFileModel) => {
  // save the file and update active file
  const saveResult = content && (await saveFile({ ...activeFile, content }))
  if (!saveResult) return false

  saveResult?.file &&
    await setActiveFileFromType(saveResult?.file)

  return true
}
