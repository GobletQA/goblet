import { Request, Response } from 'express'
import { getUserRepos } from '@gobletqa/workflows'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Gets the status of a connected repo
 * Calls the statusGoblet workflow
 */
export const statusContainer = asyncWrap(async (req:Request, res:Response) => {
  const { conductor } = req.app.locals

  // Call conductor to ensure a container is running for the user
  const status = await conductor.status({ headers: req.headers })

  // Figure out where to get the token from
  // @ts-ignore
  const repos = await getUserRepos({ token: req?.user?.token })

  // Finally return the data based on the repo status
  return apiRes(res, { status, repos }, 200)
})


AppRouter.get(`/container/status`, statusContainer)
