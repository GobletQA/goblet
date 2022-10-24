import type { TTestsModel } from '../types'
import { buildModel } from './buildModel'

/**
 * Model for all test types
 * @typedef TestsModel
 * @property {Array} features - Holds all feature file models
 * @property {Array} definitions - Holds all definition file models
 * @property {Array} jest - Holds all jest test file models
 * @property {Array} waypoint - Holds all waypoint test file models
 */
const Model = {
  features: [],
  definitions: [],
  jest: [],
  unit: [],
  waypoint: [],
}

export const testsModel = (overrides:Partial<TTestsModel>):TTestsModel => buildModel<TTestsModel>(overrides, Model)
