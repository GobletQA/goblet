// import type { Express } from 'express'
// import type { TSocketEvtCBProps } from '@GSC/types'

// import type { TJokerReq } from '@gobletqa/joker'
// import { JokerResponse } from '@gobletqa/joker'
// import { jokerAction } from '@GSC/libs/joker/jokerAction'

// import { withRepo } from '@GSC/utils/withRepo'
// import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'



// export const jokerRequest = (app:Express) => withRepo<TSocketEvtCBProps<TJokerReq>>(async ({
//   repo,
//   data,
//   socket,
//   Manager,
// }) => {
//   const { browser } = data
//   const browserConf = joinBrowserConf(browser, app)

//   const resp = await jokerAction(data, {
//     repo,
//     browserConf
//   })

//   resp && Manager.emit(socket, JokerResponse, {data: resp})

// })

export {}