import type { Request, Response } from 'express'

import path from 'node:path'
import { AppRouter } from '@gobletqa/shared/api'
import { InternalPaths } from '@gobletqa/environment/constants'

/**
 * Responds with the test run html report
 */
export const downloadReport = async (req:Request, res:Response) => {
  const { location } = req.query
  const downloadLoc = path.join(InternalPaths.reportsTempDir, location as string)
  const downloadName = path.basename(downloadLoc)

  res.download(downloadLoc, downloadName)
}

AppRouter.get(`/repo/:repo/files/reports/download`, downloadReport)