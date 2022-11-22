require('./resolveRoot')
const { noOpObj } = require('@keg-hub/jsutils')
const { startVNC } = require('@GSC/libs/vnc/vnc')
const { startSockify } = require('@GSC/libs/vnc/sockify')
const { startServerAsWorker } = require('@GSC/libs/playwright')

;(async () => {
  const type = process.argv.slice(2).shift()
  switch(type){
    case `sock`: {
      startSockify(noOpObj)
      break
    }
    case `vnc`: {
      startVNC(noOpObj)
      break
    }
    case `browser`: {
      startServerAsWorker(noOpObj)
      break
    }
    case `all`: {
      startSockify(noOpObj)
      startVNC(noOpObj)
      // Commenting this out for now as it's not working
      // Only works when manually started
      // Need to investigate
      // startServerAsWorker(noOpObj)
      break
    }
    default: {
      throw new Error(`Invalid type ${type} passed. Type must be one of "vnc" or "sock"`)
    }
  }
})()