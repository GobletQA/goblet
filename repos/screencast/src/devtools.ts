import '../resolveRoot'
import { exec } from 'child_process'
import { ife } from '@keg-hub/jsutils/ife'
import { Logger } from '@GSC/utils/logger'
import { ENVS } from '@gobletqa/environment'
import { InternalPaths } from '@gobletqa/environment/constants'

/**
 * Runs a simple proxy for forwarding devtools requests
 
 ssh 9019:localhost:9020
 
 */
ife(async () => {
  // 9222:localhost:9222 root@localhost
  const devtoolsPort =  ENVS.GB_REMOTE_DEBUG_PORT

  const cmdArgs = [
      `${devtoolsPort}:localhost:${devtoolsPort}`,
      
      `user@host`
  ]

  const cmdOpts = {
    stdio: 'inherit',
    cwd: InternalPaths.gobletRoot,
    env: process.env,
  }

  // mapport 9999 10.0.0.1:22
  const cmd = `ssh ${cmdArgs.join(' ')}`
  // Logger.info(`Starting TigerVnc server`, { cmd })

  return exec(cmd, cmdOpts)

})
