import { TFileModel } from '@types'

import { FileTypes } from '@constants'
import { exists } from '@keg-hub/jsutils'
import { setActiveFile } from './setActiveFile'
import { addToast } from '../../toasts/addToast'

/**
 * Calls the activeFile method for the fileModel based on the file type
 *
 * @returns {void}
 */
export const setActiveFileFromType = (
  fileModel:TFileModel,
  mergeQuery?:boolean
) => {

  switch (fileModel.fileType) {
    case FileTypes.REPORT:
      console.log(`------- Figure out what to do for reports -------`)
      return null
    case FileTypes.FEATURE:
      return setActiveFile(fileModel, exists(mergeQuery) ? mergeQuery : true)
    case FileTypes.UNIT:
    case FileTypes.WAYPOINT:
    case FileTypes.DEFINITION:
    case FileTypes.SUPPORT:
      // Eventually we want to support other file type clasifications
      // This includes general support, html and markdown class types
      // case FileTypes.HTML:
      // case FileTypes.DOCS:
      return setActiveFile(fileModel, exists(mergeQuery) ? mergeQuery : false)
    default:
      return addToast({
        type: `error`,
        message: `Could not ${fileModel.name} active. Unknown file type ${fileModel.fileType}`,
      })
  }
}
