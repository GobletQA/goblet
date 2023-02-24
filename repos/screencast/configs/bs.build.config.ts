import { GSCRoot } from '../resolveRoot'
import { ESBuild } from './esbuild'
import path from 'path'

ESBuild({
  outFile: path.join(GSCRoot, `dist/bs.js`),
  entryFile: path.join(GSCRoot, `src/bs.ts`),
  dev: process.env.npm_lifecycle_event === `bs:start`,
})
