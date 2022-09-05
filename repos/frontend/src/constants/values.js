import { deepFreeze } from '@keg-hub/jsutils'

import { tabs } from './tabs'
import { tests } from './tests'
import { types } from './types'
import { storage } from './storage'
import { screens } from './screens'
import { isDev } from 'HKUtils/isDev'
import { container } from './container'
import { categories } from './categories'
import { screencast } from './screencast'
const screencastPort = process.env.GB_SC_PORT || `7006`
const wsConfig = JSON.parse(process.env.WS_SERVER_CONFIG)

// TODO: @lance-tipton - This should only exist in deployed envs
if(!isDev) wsConfig.port = ''

let Values = deepFreeze({
  ...{
    EMPTY_STEP: `None Selected`,
    EMPTY_PARAM: `PARAMETER`,
    VERTICAL_BAR_HEIGHTS: 170,
    CREATE_NEW_FILE: 'Create New File',
    CREATE_NEW_REPO: 'Create New Repo',
    DOM_STYLES_ID: 'keg-dom-styles',
    TAP_PATH_PREFIX: '/goblet/app/repos',
    SCREENCAST_CANVAS: `screencast-canvas-element`,
    PARKIN_SPEC_RESULT_LOG: `------- PARKIN SPEC RESULT LOG -------`,
    GB_SC_PORT: screencastPort,
    WS_CONFIG: wsConfig,
  },
  ...storage,
  ...screens,
  ...tests,
  ...categories,
  ...tabs,
  ...screencast,
  ...types,
  ...container
})

/**
 * Allows settings the file types from the server when they are loaded for a repo
 */
export const setFileTypeConstants = fileTypes => {
  Values = deepFreeze({...Values, FILE_TYPES: {...Values.FILE_TYPES, ...fileTypes}})
}


export {
  Values
}