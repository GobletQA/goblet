import type { Socket } from 'socket.io'
import type {
  Repo,
  TGBWorldCfg,
  TBrowserConf,
  TBrowserPage,
  TBrowserContext,
  TBrowserContextOpts,
} from '@GSC/types'

import { get } from '@keg-hub/jsutils/get'
import { emptyObj } from '@keg-hub/jsutils/emptyObj'
import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { browserEvents } from '@GSC/utils/browserEvents'
import { SocketManager } from '@GSC/libs/websocket/manager/manager'
import { joinBrowserConf } from '@GSC/utils/joinBrowserConf'

import {
  GBrowser,
  GobletQAUrl,
} from '@gobletqa/browser'

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
  repo?:Repo
  world?:TGBWorldCfg
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
        context?.__contextGoblet?.extraHTTPHeaders,
        world?.$context?.extraHTTPHeaders,
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
  const { repo, world=repo.world } = props
  const args = {...props, world}
  
  // TODO: need to get the gobletConfig and pass it in here
  const browserConf = joinBrowserConf(props.browser)
  const browserOpts = { browserConf, world, config: repo }
  const { context, page } = await GBrowser.get(browserOpts)

  const url = getPageUrl(args, page)
  const extraCtxOpts = await getCtxOptions(args, browserConf, context)

  context && await context.close()

  await GBrowser.start({
    ...browserOpts,
    initialUrl: url,
    overrides: { context: extraCtxOpts },
  })

  const pwComponents = await GBrowser.get(browserOpts)
  global.context = pwComponents.context

  browserEvents({
    ...args,
    browserConf,
    pwComponents,
    ...getSocket(props),
  })
}
