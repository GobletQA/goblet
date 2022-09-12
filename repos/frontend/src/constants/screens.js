import { deepFreeze } from '@keg-hub/jsutils'
import { isVNCMode } from 'GBUtils/isVNCMode'

const screenMap = {
  EMPTY: 'empty',
  EDITOR: 'editor',
  REPORTS: 'reports',
  // BUILDER: 'builder',
}

if (isVNCMode()) screenMap.SCREENCAST = 'screencast'

export const screens = deepFreeze({
  SCREENS: screenMap,
})
