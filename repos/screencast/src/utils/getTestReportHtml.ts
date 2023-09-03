import path from 'path'
import { fileSys } from '@keg-hub/cli-utils'
import { getMountRootDir } from './getMountRootDir'
import { reportHeight } from '@gobletqa/shared/templates/reportHeight.template'

const { pathExists, readFile } = fileSys

const getHtmlContent = async (location:string) => {
  const [err, exists] = await pathExists(location)
  if (!exists || err) return undefined

  const [__, content] = await readFile(location)
  return content
}

/**
 * Loads a report by it's name and fileType
 * If not found, loads the reports404 template
 * @param {Object} repo - Repo Class instance for the active repo
 * @param {string} fileType - Type of test file the report is for
 * @param {string} reportName - Name of the report to load
 *
 * @return {string} - Loaded report html or reports404 html if not found
 */
export const getTestReportHtml = async (reportPath:string) => {
  if (!reportPath) return undefined

  // Remove the path ext if it exists
  // Then add the .html ext to it
  const reportLoc = `${reportPath.replace(path.extname(reportPath), '')}.html`
  const location = path.join(getMountRootDir(), reportLoc)

  // Then load the html content for the location
  // For a 404 page if it does not
  const content = await getHtmlContent(location)

  // Add the inject reportHeight template to the content
  // It allows setting the height of the IFramed report in the UI
  return content && `${content}${reportHeight}`
}
