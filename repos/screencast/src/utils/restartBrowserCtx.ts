import type { Socket } from 'socket.io'
import type { SocketManager } from '@GSC/libs/websocket/manager/manager'
import type {
  Repo,
  TBrowser,
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

const getCtxOptions = (
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

const getBrowserOpts = (
  props:TRestartContext,
  browserConf:TBrowserConf,
  browser:TBrowser
) => {
  const { world } = props
  const browserOpts = get(global, `__goblet.browser`, emptyObj)

  return deepMerge<TBrowserConf>(
    browserConf,
    browserOpts,
    world?.$browser
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

export const restartBrowserCtx = async (props:TRestartContext) => {
  const { repo, world=repo.world } = props
  const args = {...props, world}

  const browserConf = joinBrowserConf(props.browser)
  const browserOpts = {world, config: repo, browserConf }
  const { browser, context, page } = await GBrowser.get(browserOpts)

  const url = getPageUrl(args, page)

  const pwComponents = await GBrowser.restartContext({
    ...browserOpts,
    initialUrl: url,
    overrides: { context: getCtxOptions(args, browserConf, context) },
    browserConf: getBrowserOpts(args, browserConf, browser),
  })

  global.context = pwComponents.context
  global.browser = pwComponents.browser

  return await browserEvents({
    browserConf,
    pwComponents,
    Manager: props.Manager
  })
}
