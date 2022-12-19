import '../resolveRoot'

import path from 'path'
import { esbuild } from './esbuild'
import { fileURLToPath } from 'url'
import { aliases } from '@GConfigs/aliases.config'

// @ts-ignore
const dirname = path.dirname(fileURLToPath(import.meta.url))
const dev = process.env.npm_lifecycle_event === `vnc:start`

const rootDir = path.join(dirname, `../`)
const distDir = path.join(rootDir, `dist`)
const outFile = path.join(distDir, `vnc.js`)
const entryFile = path.join(rootDir, `src/vnc.ts`)

esbuild({
  dev,
  aliases,
  outFile,
  entryFile,
  cwd: rootDir,
  envOpts: {
    noYml: true,
    name: `goblet`,
    locations: [aliases.GobletRoot],
    envs: { GOBLET_ROOT_DIR: aliases.GobletRoot },
  },
  args: [
    `--config`,
    `configs/nm.config.json`,
    `--exec`,
    `node`,
    `-r`,
    `esbuild-register`,
    outFile
  ],
})
