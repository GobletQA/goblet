import { getStore } from 'GBStore'
import { Values } from 'GBConstants'
import { setTestRun } from './setTestRun'
import { addToast } from 'GBActions/toasts'
import { get, noOpObj } from '@keg-hub/jsutils'
import { getReportsActiveFile } from 'GBUtils/helpers/getReportsActiveFile'

const { CATEGORIES } = Values

/**
 * Updates the active property of a testRunModel
 * @param {Object} testRunModel - The testRun model to set active
 * @param {Object} activeFile - Active fileModel for the currently active screen
 *
 * @returns {void}
 */
export const setTestRunActive = (testRunModel, activeFile) => {
  const { items } = getStore().getState()
  activeFile = activeFile || getReportsActiveFile() || noOpObj
  testRunModel =
    testRunModel || get(items, [CATEGORIES.TEST_RUNS, activeFile.location])

  testRunModel
    ? setTestRun({ ...testRunModel, active: true })
    : addToast({
        type: `error`,
        timeout: 6000,
        message: `Can not set testRun active. A testRun model is required!`,
      })
}
