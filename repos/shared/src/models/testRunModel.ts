import type { TTestRunModel } from '../types'
import { buildModel } from './buildModel'

/**
 * Model for the output of tests that were run
 * @typedef TestRunModel
 * @property {string} file - Location of the test file the run is associated with
 * @property {string} fileType - The type of tests that were run
 * @property {string} lastRun - The last time these tests were run
 * @property {boolean} active - Is the testRun active in the view
 * @property {boolean} running - Is the testRun currently running
 * @property {array} output - Most recent test run output
 */
const Model = {
  file: '',
  fileType: '',
  lastRun: '',
  exitCode: undefined,
  failed: false,
  active: false,
  running: false,
  command: undefined,
  params: [],
  messages: {},
}

export const testRunModel = (overrides:Partial<TTestRunModel>):TTestRunModel => buildModel<TTestRunModel>(overrides, Model)
