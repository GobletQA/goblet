import type { Socket } from 'socket.io'
import type { TBrowserConf } from '@GSC/types'

import { GobletQAUrl } from '@GSC/constants'
import { SocketManager } from '@GSC/libs/websocket/manager/manager'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'
import {
  startBrowser,
  getPWComponents,
} from '@GSC/libs/playwright/browser/browser'

type TRestartWId = {
  socket?:never
  socketId:string
}

type TRestartWSocket = {
  socket:Socket
  socketId?:never
}
type TRestartSocket = TRestartWId|TRestartWSocket

export type TRestartBrowser = TRestartSocket & {
  url?:string
  Manager?:SocketManager
  browser?:Partial<TBrowserConf>
}

export const restartBrowser = async (props:TRestartBrowser) => {
  const {
    url:pUrl,
    socket,
    browser,
    socketId,
  } = props
  // const { repo } = await Repo.status(app.locals.config, { ...repo, ...user })
  // let extraCtxOpts:Record<any, any> = {
  //     extraHTTPHeaders: repo.world.$headers || {}
  // }
  let extraCtxOpts:Record<any, any> = {}
    

  const browserConf = joinBrowserConf(browser)
  const { context, page } = await getPWComponents(browserConf)

  // TODO: more a lot of this to setBrowserDefaults
  const pageUrl = page.url()

  const url = pageUrl !== GobletQAUrl
    ? pageUrl
    : pUrl || GobletQAUrl

  if(context){
    // TODO: FIX this hack
    if(context?.__goblet?.extraHeaders)
      extraCtxOpts.extraHTTPHeaders = {
        ...extraCtxOpts.extraHTTPHeaders,
        ...context?.__goblet?.extraHeaders
      }

    // TODO: need to investigate
    // Should be working but causes an error on useverb site
    // extraCtxOpts.storageState = await context.storageState()
    // await saveContextStorageState(context)
    // extraCtxOpts.storageState = contextStorageLoc()
    // savedCookie = await saveContextCookie(context)
    context && await context.close()
  }

  const confOverrides = extraCtxOpts.extraHTTPHeaders
    ? {...browserConf, context: extraCtxOpts }
    : browserConf

  await startBrowser(browserConf, false, false, confOverrides, url)

  const pwComponents = await getPWComponents(browserConf)

  // Reset the cookies if they were saved
  // savedCookie && await setContextCookie(pwComponents.context)

  browserEvents({
    ...props,
    pwComponents,
    browser: browserConf,
    Manager: SocketManager.instance,
    socket: socket || SocketManager.instance.peers[socketId]
  })
}
