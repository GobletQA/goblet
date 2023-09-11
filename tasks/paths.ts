import os from 'os'
import path from 'path'
import { GobletRoot } from '../gobletRoot'
import { getRepoPaths } from './utils/helpers/getRepoPaths'

export const homeDir = os.homedir()
export const reposDir = path.join(GobletRoot, `repos`) 
export const appRoot = GobletRoot
export const tempDir = os.tmpdir()
export const repos = getRepoPaths(reposDir)
export const distDir = path.join(GobletRoot, `dist/app`)
export const scriptsDir = path.join(GobletRoot, `scripts`)
export const frontendDir = path.join(GobletRoot, `repos/vite`)
export const containerDir = path.join(GobletRoot, `container`)
export const testUtilsDir = path.join(GobletRoot, `repos/testUtils`)
