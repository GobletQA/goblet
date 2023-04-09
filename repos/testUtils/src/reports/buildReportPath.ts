import type { TGobletConfig } from '@GTU/Types'

import path from 'path'
import { getPathFromBase } from '@gobletqa/shared/utils/getPathFromBase'
import { getGeneratedName } from '@GTU/Playwright/generatedArtifacts'

type TBuildReportPathOpts = {
  context:string
  testReportName:string
}


/**
 * Gets the name for the report based on the name of the test being run
 * If no name, then uses the test type
 *
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 *
 * @return {string} - Name to use for the report
 */
const getReportName = (
  reportName:string,
  context:string,
  type:string
) => {
  return `/${path.basename(reportName || context || (type + 's'))}`
}

/**
 * Builds a path to a test report based on the type and name
 * Adds a date timestamp to the report file name
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 * @param {Object} config - Goblet global config object
 *
 * @returns {string} - Path where the report should be created
 */
export const buildReportPath = (
  type:string,
  { context, testReportName }:TBuildReportPathOpts,
  config:TGobletConfig,
  browser:string
) => {
  if (!type)
    throw new Error(`Test type is required to build the test report path!`)

  type = type === `bdd` ? `feature` : type
  const { full } = getGeneratedName(
    getReportName(testReportName, context, type),
    type,
    browser
  )

  const reportsDir = getPathFromBase(config.paths.reportsDir, config)
  // Example: goblet/artifacts/reports/features/my-tests/my-tests-chrome-12345.html
  // The date/time stamp is always added to allow search and filtering by name
  return path.join(reportsDir, `${full}.html`)
}

