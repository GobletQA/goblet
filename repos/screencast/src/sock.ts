import type { TChildProcArgs } from '@GSC/types'

import '../resolveRoot'
import { parseJSON, noOpObj } from '@keg-hub/jsutils'
import { startSockify, stopSockify } from '@GSC/libs/vnc/sockify'

/**
 * Runs the websockify server
 */
;(async () => {
  const [ sockifyOpts ] = process.argv.slice(2)
  const opts = (parseJSON(sockifyOpts, false) || noOpObj) as TChildProcArgs
  await startSockify(opts)

  let exitCalled:boolean=false
  Array.from([
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'TERM',
    'SIGTERM'
  ])
    .map(event => process.on(event, (exitCode) => {
      if(exitCalled) return
      exitCalled = true
      
      stopSockify()
    }))

})()

