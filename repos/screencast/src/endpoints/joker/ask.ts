// import { jokerAI } from '@gobletqa/joker/jokerAI'


// import type { Response, Request } from 'express'
// import { isStr } from '@keg-hub/jsutils/isStr'
// import { limbo } from '@keg-hub/jsutils/limbo'
// import { apiRes } from '@gobletqa/shared/api'
// import { AppRouter } from '@gobletqa/shared/api'

// /**
//  * Sends a prompt to Joker AI
//  * @param {Object} req.params
//  * @param {string} params.type - The browser type to start [chromium|firefox]
//  *
//  */
// export const askAI = async (req:Request, res:Response) => {
//   const {
//     question
//   } = req.body

//   return apiRes(res, {}, 200)
  
//   // if(!isStr(question)) throw new Error(`A question is required`)

//   // const [err, resp] = await limbo(jokerAI.ask({ question }))

//   // return apiRes(res, resp, 200)
// }

// AppRouter.post(`/joker/askAI`, askAI)

export {}