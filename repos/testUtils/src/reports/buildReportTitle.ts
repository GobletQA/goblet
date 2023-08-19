import path from 'path'
import { wordCaps } from '@keg-hub/jsutils/wordCaps'
import { capitalize } from '@keg-hub/jsutils/capitalize'

/**
 * Builds a title of a test report based on the type and context
 * @param {string} type - Type of tests for the report
 * @param {string} [name=type] - Name of the test related to the report
 *
 * @returns {string} - Title of the report
 */
export const buildReportTitle = (
  type:string,
  name:string,
  browser:string
) => {
  const title = name && path.basename(name).split('.').shift()

  const built = title
    ? wordCaps(title)
    : type
    ? `${wordCaps(type)} Test Suite`
    : `Test Suite`

  return browser
    ? `${built} - ${capitalize(browser)}`
    : built
}
