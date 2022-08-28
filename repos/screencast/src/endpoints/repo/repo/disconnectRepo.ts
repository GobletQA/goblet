import { Request, Response } from 'express'
import { Repo } from '@gobletqa/shared/repo/repo'
import { asyncWrap, apiRes } from '@gobletqa/shared/express'
import { AppRouter } from '@gobletqa/shared/express/appRouter'

/**
 * Disconnects a connected repo ( VNC mode only )
 */
export const disconnectRepo = asyncWrap(async (req:Request, res:Response) => {
  // TODO: Add req.body validation
  const { disconnectTimeout } = req?.app?.locals?.config?.container

  if(disconnectTimeout){
    console.log(`Waiting ${disconnectTimeout} seconds to kill container...`)
    setTimeout(() => {
      console.log(`Killing session container due to user log out.`)
      process.exit(0)
    }, disconnectTimeout)
  }

  const repo = await Repo.disconnect(req.body)
  return apiRes(res, { repo }, 200)
})

AppRouter.post('/repo/disconnect', disconnectRepo)