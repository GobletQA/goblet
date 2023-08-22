import type { TChildProcArgs } from '@GSC/types'

import '../resolveRoot'
import { noOpObj } from '@keg-hub/jsutils/noOpObj'
import { startVNC, stopVNC } from '@GSC/libs/vnc/vnc'
import { parseJSON } from '@keg-hub/jsutils/parseJSON'

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
