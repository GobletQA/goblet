import { Request, Response } from 'express'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'
import { loadRepoContent } from '@gobletqa/shared/repo/loadRepoContent'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusRepo = asyncWrap(async (req:Request, res:Response) => {
  const { conductor } = req.app.locals

  // First call conductor to ensure a container is running for the user
  // /container/status/:imageRef
  const status = await conductor.request({
    url: `/container/spawn/goblet?ensure=1`,
    headers: req.headers
  })
  
  console.log(`------- status -------`)
  console.log(status)

  // Next get the repo status based on the container status
  
  // Finally return the data based on the repo status
  return apiRes(res, { status }, 200)
})


AppRouter.get(`/repo/status`, statusRepo)
