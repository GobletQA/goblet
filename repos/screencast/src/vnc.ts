import type { TChildProcArgs, TBrowserConf } from '@GSC/types'

import '../resolveRoot'
import { noOpObj } from '@keg-hub/jsutils'
import { startVNC } from '@GSC/libs/vnc/vnc'
import { startSockify } from '@GSC/libs/vnc/sockify'

;(async () => {
  const type = process.argv.slice(2).shift()
  switch(type){
    case `sock`: {
      const proc = await startSockify(noOpObj as TChildProcArgs)
      proc?.unref?.()
      break
    }
    case `vnc`: {
      const proc = await startVNC(noOpObj as TChildProcArgs)
      proc?.unref?.()
      break
    }
    case `all`: {
      const sockProc = await startSockify(noOpObj as TChildProcArgs)
      sockProc?.unref?.()

      const vncProc = await startVNC(noOpObj as TChildProcArgs)
      vncProc?.unref?.()

      break
    }
    default: {
      throw new Error(`Invalid type ${type} passed. Type must be one of "vnc", "sock", "browser", or "all"`)
    }
  }
})()