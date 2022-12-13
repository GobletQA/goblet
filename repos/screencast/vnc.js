require('./resolveRoot')
const { noOpObj } = require('@keg-hub/jsutils')
const { startVNC } = require('@GSC/libs/vnc/vnc')
const { startSockify } = require('@GSC/libs/vnc/sockify')
const { startServerAsWorker } = require('@GSC/libs/playwright')

;(async () => {
  const type = process.argv.slice(2).shift()
  switch(type){
    case `sock`: {
      const proc = await startSockify(noOpObj)
      proc?.unref?.()
      break
    }
    case `vnc`: {
      const proc = await startVNC(noOpObj)
      proc?.unref?.()
      break
    }
    case `browser`: {
      const proc = await startServerAsWorker(noOpObj)
      proc?.unref?.()
      break
    }
    case `all`: {
      const sockProc = await startSockify(noOpObj)
      sockProc?.unref?.()

      const vncProc = await startVNC(noOpObj)
      vncProc?.unref?.()

      const browserProc = await startServerAsWorker(noOpObj)
      browserProc?.unref?.()
      break
    }
    default: {
      throw new Error(`Invalid type ${type} passed. Type must be one of "vnc" or "sock"`)
    }
  }
})()