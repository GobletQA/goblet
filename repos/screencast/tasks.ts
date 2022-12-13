import type { TBrowserConf } from '@GSC/types'

import './resolveRoot'
import { Logger } from '@GSC/utils/logger'
import { get, wait } from '@keg-hub/jsutils'
import {
  stopServer,
  statusServer,
  startServerAsWorker,
} from '@GSC/libs/playwright'
import {
  stopVNC,
  startVNC,
  statusVNC,
  stopSockify,
  startSockify,
  statusSockify,
} from '@GSC/libs/vnc'


const resolveContext = (context:string) => {
  if(!context || context === `all` || context === `a`) return { sock:true, vnc:true, browser:true }
  if(context === `vnc` || context === `v`) return { sock:false, vnc:true, browser:false }
  if(context === `sock` || context === `s`) return { sock:true, vnc:false, browser:false }
  if(context === `browser` || context === `b`) return { sock:false, vnc:false, browser:true }

  return context.split(`,`)
    .reduce((acc, item) => {
      if(item in acc) acc[item] = true

      return acc
    }, { sock:false, vnc:false, browser:false })
}

const delayStartBrowser = async (params?:TBrowserConf) => {
  await wait(3000)
  return startServerAsWorker(params)
}

export const runSCTask = async (type:string, params:Record<any, any>) => {
  const { context, log } = params
  const procs:Record<string, Record<any, any>> = {}
  const { sock, vnc, browser } = resolveContext(params.context as string)

  switch(type){
    case 'status': {
      const status = {} as any
      if(vnc) status.vnc = await statusVNC()
      if(sock) status.sockify = await statusSockify()
      if(browser){
        const { chromium } = await statusServer()
        status.browser = chromium
      }
      Logger.info(status)
      break
    }
    case 'stop': {
      await Promise.all([
        vnc && stopVNC(),
        sock && stopSockify(),
        browser && stopServer(),
      ])
      break
    }
    case 'start': {
      const proms = await Promise.all([
        vnc && startVNC(params.vnc),
        sock && startSockify(params.sock),
        browser && delayStartBrowser(params.browser)
      ])

      ;[`vnc`, `sock`, `browser`].forEach((item, idx) => {
        const proc = proms[idx]
        proc?.unref?.()
        procs[item] = proc
      })
      break
    }
    case 'restart': {
      await Promise.all([
        vnc && stopVNC(),
        sock && stopSockify(),
        browser && stopServer(),
      ])
      
      await wait(2000)

      if(vnc){
        const vncProc = await startVNC(params.vnc)
        vncProc?.unref?.()
        procs.vnc = vncProc
      }
      if(sock){
        const sockProc = await startSockify(params.sock)
        sockProc?.unref?.()
        procs.sock = sockProc
      }
      if(browser){
        const browserProc = await startServerAsWorker(params.browser)
        browserProc?.unref?.()
        procs.browser = browserProc
      }
      break
    }
    case 'pid': {
      const status = {} as any
      if(vnc) status.vnc = await statusVNC()
      if(sock) status.sockify = await statusSockify()
      if(browser){
        const { chromium } = await statusServer()
        status.browser = chromium
      }
      const pid = get(status, `${context}.pid`)
      pid
        ? Logger.log(pid)
        : log && Logger.warn(`Pid not found for context ${context}`)

      return procs
    }
    default:
      Logger.error(`Unknown screencast task action ${type}`)
      break
  }

  return procs
}
