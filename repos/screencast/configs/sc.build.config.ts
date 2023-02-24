import { GSCRoot } from '../resolveRoot'
import { ESBuild } from './esbuild'
import path from 'path'

ESBuild({
  entryFile: path.join(GSCRoot, `index.ts`),
  outFile: path.join(GSCRoot, `dist/index.js`),
  dev: process.env.npm_lifecycle_event === `sc:start`,
})
