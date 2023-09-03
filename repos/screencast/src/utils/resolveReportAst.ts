import path from 'path'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getMountRootDir } from './getMountRootDir'



/**
 * Checks if a path is in the reports folder
 * If it is, then build an ast object with the fileType
 * @param {string} fullPath - Full path to the file to check
 * @param {string} baseDir - Root location of test files
 * @param {string} reportsDir - Directory where reports are stored
 *
 * @returns {Object} - Reports ast || empty object
 */
export const resolveReportAst = (
  repo:Record<any, any>,
  fullPath:string,
  baseDir:string
) => {
  const { reportsDir } = repo.paths
  return fullPath.startsWith(path.join(baseDir, reportsDir))
    ? {
        ast: {
          fileType: fullPath.split(`${reportsDir}/`).pop().split('/').shift(),
          // Generate the full url for resolving the report file, not including the domain
          reportUrl: `/repo/${repo.name}/reports${fullPath.replace(
            getMountRootDir(),
            ''
          )}`,
        },
      }
    : noOpObj
}
