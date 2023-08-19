import type { TGobletConfig } from '../types'

import path from 'path'
import { getGobletConfig } from '../getGobletConfig'

/**
 * Helper to find the base directory all the other repo paths are relative to
 * Joins the repoRoot and workDir together is workDir exists
 * Otherwise returns repoRoot

 */
export const getRepoGobletDir = (config?:TGobletConfig) => {
  config = config || getGobletConfig()
  const { repoRoot, workDir } = config.paths

  return workDir ? path.join(repoRoot, workDir) : repoRoot
}

