const { startVNC } = require('@GSC/libs/vnc/vnc')
const { startSockify } = require('@GSC/libs/vnc/sockify')
const { noOpObj } = require('@keg-hub/jsutils')

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
    case `all`: {
      startSockify(noOpObj)
      startVNC(noOpObj)
      break
    }
    default: {
      throw new Error(`Invalid type ${type} passed. Type must be one of "vnc" or "sock"`)
    }
  }
})()