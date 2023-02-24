import { GSCRoot } from '../resolveRoot'
import { ESBuild } from './esbuild'
import path from 'path'

ESBuild({
  outFile: path.join(GSCRoot, `dist/vnc.js`),
  entryFile: path.join(GSCRoot, `src/vnc.ts`),
  dev: process.env.npm_lifecycle_event === `vnc:start`,
})
