import type { TRepo } from '@GSH/types'
import path from 'path'
import { ENVS } from '@gobletqa/environment'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { getRepoGobletDir } from '@gobletqa/goblet'
import { buildFileModel } from '@GSH/models/buildFileModel'

/**
 * Checks if a path is in the reports folder
 * If it is, then build an ast object with the fileType
 * @param {string} fullPath - Full path to the file to check
 * @param {string} baseDir - Root location of test files
 * @param {string} reportsDir - Directory where reports are stored
 *
 * @returns {Object} - Reports ast || empty object
 */
const resolveReportAst = (
  repo:TRepo,
  fullPath:string,
  baseDir:string
) => {
  const { reportsDir=`artifacts/reports` } = repo.paths
  return fullPath.startsWith(path.join(baseDir, reportsDir))
    ? {
        ast: {
          fileType: fullPath.split(`${reportsDir}/`).pop().split('/').shift(),
          // Generate the full url for resolving the report file, not including the domain
          reportUrl: `/repo/${repo.name}/reports${fullPath.replace(
            path.resolve(ENVS.GOBLET_MOUNT_ROOT),
            ''
          )}`,
        },
      }
    : noOpObj
}

/**
 * Checks the files path and if it exists creates a fileModel from the meta data
 */
export const loadReport = async (
  repo:TRepo,
  location:string,
  baseDir?:string
) => {
  baseDir = baseDir || getRepoGobletDir(repo)
  const reportContent = resolveReportAst(repo, location, baseDir)

  // Build the file model for the report file
  return await buildFileModel({
    location,
    fileType: 'report',
    ...reportContent,
  }, repo)
}
