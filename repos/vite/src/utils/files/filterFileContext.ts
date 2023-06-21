import type { TFileModel, TStartBrowserPlayOpts } from '@types'

import { FileTypes } from '@constants'
import { emptyObj } from '@keg-hub/jsutils'
import { filterSimpleFeature } from '@utils/features/filterSimpleFeature'

export const filterFileContext = async (
  file:TFileModel,
  filterOpts:TStartBrowserPlayOpts=emptyObj
) => {

  switch(file?.fileType){
    case FileTypes.FEATURE: {
      return await filterSimpleFeature(file, filterOpts)
    }
    // Add filters for other types here
    // Or return the default file model
    default: {
      return file
    }
  }

}