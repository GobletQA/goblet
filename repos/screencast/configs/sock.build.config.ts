import { GSCRoot } from '../resolveRoot'
import { ESBuild } from './esbuild'
import path from 'path'

ESBuild({
  outFile: path.join(GSCRoot, `dist/sock.js`),
  entryFile: path.join(GSCRoot, `src/sock.ts`),
  dev: process.env.npm_lifecycle_event === `sock:start`,
})
