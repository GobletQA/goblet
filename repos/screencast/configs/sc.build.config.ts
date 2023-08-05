import { GSCRoot } from '../resolveRoot'
import { ESBuild } from './esbuild'
import path from 'path'

const outfile = path.join(GSCRoot, `dist/index.js`)
const nmCfg = path.join(GSCRoot, `configs/nm.config.json`)

ESBuild({
  outFile: outfile,
  entryFile: path.join(GSCRoot, `index.ts`),
  dev: process.env.npm_lifecycle_event === `sc:start`,
  nodemonOpts: {
    merge: false,
    args: [
      `--config`,
      nmCfg,
      `--ignore`,
      `**/*`,
      `--exec`,
      `node`,
      `--enable-source-maps`,
      `-r`,
      `esbuild-register`,
      `scripts/blocking.js`,
      outfile
    ],
  }
})
