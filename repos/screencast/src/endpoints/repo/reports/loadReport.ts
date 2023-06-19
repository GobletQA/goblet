import { Request, RequestHandler, Response } from 'express'
import { htmlErr }from '@gobletqa/shared/express/htmlErr'
import { htmlRes }from '@gobletqa/shared/express/htmlRes'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { asyncWrap } from '@gobletqa/shared/express/asyncWrap'
import { getTestReportHtml }from '@GSC/utils/getTestReportHtml'
import { loadTemplate }from '@gobletqa/shared/templates/loadTemplate'

/**
 * Loads reports from the passed in params
 */
export const loadReport:RequestHandler = asyncWrap(async (req:Request, res:Response) => {
  // Load the default 404 page for non-existing reports
  const report404 = await loadTemplate('reports404')

  // Get the path to the report from the non-parsed url param
  const reportPath = req.params['0']
  // Ensure the reportPath exists
  if (!reportPath) throw new Error(report404)

  // Load the report html
  const reportHtml = await getTestReportHtml(reportPath)
  // If no report html could be loaded, then throw
  if (!reportHtml) throw new Error(report404)

  // Resolve with the report html
  return htmlRes(res, reportHtml)
}, htmlErr)


AppRouter.get('/repo/:repo/reports/*', loadReport)
