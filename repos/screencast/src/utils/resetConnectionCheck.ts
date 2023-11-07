import { ENVS } from '@gobletqa/environment'
import { InternalPaths } from '@gobletqa/environment/constants'
import path from 'node:path'
import { promises as fs } from 'fs'


export const resetConnectionCheck = async () => {
  const sentinelLoc = path.join(InternalPaths.appTempDir, ENVS.GB_SC_RESET_CONNECTION_FILE)
  await fs.writeFile(sentinelLoc, `Reset Connection Check!!!`, `utf8`)
}
