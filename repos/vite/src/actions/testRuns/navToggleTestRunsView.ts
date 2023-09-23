import { getStore } from '@store'
import { toggleTestRunsView } from './toggleTestRunsView'

/**
 * This method intentionally returns 3 different type
 * True / False / Undefined
 * True - the caller should can proceed
 * False - the caller should NOT proceed
 * Undefined - the caller can decide what to do
 */
export const navToggleTestRunsView = () => {
  const { testRuns, app } = getStore().getState()
  if(!app.testRunsView) return true
  if(testRuns.allTestsRunning) return false

  toggleTestRunsView(false)
}