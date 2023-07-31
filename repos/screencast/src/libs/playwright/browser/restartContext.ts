import type { Socket } from 'socket.io'
import type { TWorldConfig } from '@ltipton/parkin'
import type {
  TBrowserConf,
  TBrowserContext,
  TBrowserContextOpts,
  TBrowserPage
} from '@GSC/types'

import { GobletQAUrl } from '@gobletqa/shared/constants/playwright'
import { SocketManager } from '@GSC/libs/websocket/manager/manager'
import { joinBrowserConf } from '@gobletqa/shared/utils/joinBrowserConf'
import { browserEvents } from '@GSC/libs/playwright/browser/browserEvents'
import {
  startBrowser,
  getPWComponents,
} from '@GSC/libs/playwright/browser/browser'
import {deepMerge, emptyObj, get} from '@keg-hub/jsutils'

type TRestartWId = {
  socket?:never
  socketId:string
}

type TRestartWSocket = {
  socket:Socket
  socketId?:never
}
type TRestartSocket = TRestartWId|TRestartWSocket

export type TRestartContext = TRestartSocket & {
  url?:string
  world?:TWorldConfig
  Manager?:SocketManager
  browser?:Partial<TBrowserConf>
}

const getCtxOptions = async (
  props:TRestartContext,
  browserConf:TBrowserConf,
  context:TBrowserContext
) => {

  const { world } = props
  const ctxOpts = get<TBrowserContextOpts>(global, [`__goblet`, `context`, `options`], emptyObj)

  return deepMerge<TBrowserContextOpts>(
    browserConf.context,
    ctxOpts,
    world?.$context,
    {
      extraHTTPHeaders: deepMerge(
        ctxOpts?.extraHTTPHeaders,
        context?.__goblet?.extraHTTPHeaders,
        world?.$context?.extraHTTPHeaders,
        world?.$headers
      )
    }
  )
}


const getPageUrl = (
  props:TRestartContext,
  page:TBrowserPage
) => {
  const { world, url } = props
  if(url) return url
  
  const pageUrl = page.url()
  const appUrl = world?.url || world?.app?.url

  return pageUrl !== GobletQAUrl ? pageUrl : appUrl || GobletQAUrl
}

// TODO: fix this, need better way to access socket and Manager form
// step definition 
const getSocket = (props:TRestartContext) => {
  const { Manager, socket, socketId } = props

  return {
    Manager,
    socket: socket || Manager.peers[socketId],
  }
}

export const restartContext = async (props:TRestartContext) => {

  const browserConf = joinBrowserConf(props.browser)
  const { context, page } = await getPWComponents(browserConf)

  const url = getPageUrl(props, page)
  const extraCtxOpts = await getCtxOptions(props, browserConf, context)

  context && await context.close()

  await startBrowser({
    browserConf,
    initialUrl: url,
    overrides: { context: extraCtxOpts },
  })

  const pwComponents = await getPWComponents(browserConf)
  global.context = pwComponents.context

  browserEvents({
    ...props,
    browserConf,
    pwComponents,
    ...getSocket(props),
  })
}
