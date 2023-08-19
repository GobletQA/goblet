import type { TChildProcArgs } from '@GSC/types'

import '../resolveRoot'
import { startVNC, stopVNC } from '@GSC/libs/vnc/vnc'
import { noOpObj, parseJSON } from '@keg-hub/jsutils'

/**
 * Runs tiger-vnc server
 */
;(async () => {
  const [ vncOpts ] = process.argv.slice(2)
  const opts = (parseJSON(vncOpts, false) || noOpObj) as TChildProcArgs
  await startVNC(opts)

  let exitCalled:boolean=false
  Array.from([
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'TERM',
    'SIGTERM'
  ])
    .map(event => process.once(event, (exitCode) => {
      if(exitCalled) return
      exitCalled = true

      stopVNC()
    }))

})()
