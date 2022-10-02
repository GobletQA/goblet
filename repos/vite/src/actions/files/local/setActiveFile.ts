import { TFileModel } from '@types'
import { filesDispatch } from '@store'
import { updateUrlQuery } from '@utils/url/updateUrlQuery'

/**
 * setActiveFile
 * @param {Object} fileModel - file to set as the activeFile
 * @param {string} screenId - Id of the screen to set the fileModel as the activeFile
 * @param {boolean} mergeQuery - Merge the current url query string with the updated file
 */
export const setActiveFile = (
  fileModel:TFileModel,
  screenId?:string,
  mergeQuery?:boolean
) => {

  // If the current screen is active, then also update the browser url
  updateUrlQuery({ file: fileModel.name }, Boolean(mergeQuery))
  const updatedFile = { ...fileModel }

  filesDispatch.setActive(updatedFile)

  return updatedFile
}
