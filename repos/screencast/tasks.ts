import './resolveRoot'
import { get, wait } from '@keg-hub/jsutils'
import { Logger } from '@keg-hub/cli-utils'
const {
  stopServer,
  startServer,
  statusServer,
} = require('@GSC/libs/playwright')
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
  if(context === `server` || context === `sr`) return { sock:false, vnc:false, browser:false }

  return context.split(`,`)
    .reduce((acc, item) => {
      if(item in acc) acc[item] = true

      return acc
    }, { sock:false, vnc:false, browser:false })
}

export const runSCTask = async (type:string, params:Record<any, any>) => {
  const { context, log } = params
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
      return Logger.log(status)
    }
    case 'stop': {
      if(vnc) await stopVNC()
      if(sock) await stopSockify()
      if(browser) await stopServer()
      return
    }
    case 'start': {
      if(vnc) startVNC(params.vnc)
      if(sock) startSockify(params.sock)
      // TODO: need to run browser as a worker
      if(context === `browser` || context === `b`) startServer(params.browser, true)
      return
    }
    case 'restart': {
      if(vnc){
        await stopVNC()
        await wait(2000)
        const vncProc = await startVNC(params.vnc)
        vncProc.unref()
      }
      if(sock){
        await stopSockify()
        await wait(2000)
        const sockProc = await startSockify(params.sock)
        sockProc.unref()
      }
      // TODO: need to run browser as a worker
      if(context === `browser` || context === `b`){
        await stopServer()
        await wait(2000)
        startServer(params.browser, true)
      }
      return
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

      return
    }
    default:
      Logger.error(`Unknown screencast task action ${type}`)
      return
  }

}