import type { Loader } from 'esbuild'

import path from 'path'
import {transformSync} from 'esbuild'
import { getWorld } from '@gobletqa/workflows/repo/world'
import { default as createCacheKey} from '@jest/create-cache-key-function'

/**
 * List of default loads that esbuild supports
 * Taken from the esbuild type `Loader`
 */
const loaders = [
  `js`,
  `ts`,
  `tsx`,
  `jsx`,
  `css`,
  `text`,
  `json`,
  `copy`,
  `file`,
  `empty`,
  `base64`,
  `binary`,
  `dataurl`,
  `default`,
]

const nodeVersion = process.env.NODE_ENV === `test` ? `20` : process.versions.node

export const waypointTransformer = {
  getCacheKey: createCacheKey([], []),
  process: (src:string, file:string, options:Record<string, any>) => {

    const name = file.split('/').pop()
    const extname = path.extname(file)
    const world = getWorld()
    const worldStr = JSON.stringify(world)

    const {
      map,
      code:transformCode,
    } = transformSync(src, {
      format: `cjs`,
      sourcefile: file,
      sourcemap: `inline`,
      target: `node${nodeVersion}`,
      loader: (loaders.find(ext => `.${ext}` === extname)|| `js`) as Loader,
    })

    /**
     * Wrap the transformed waypoint script in a single test
     * Ensure Jest doesn't throw or complain having no tests
     * It also allows us to use the same jest-html-test reporter
     */
    const code = [
      `describe('Goblet Waypoint', () => {`,
      `  test('Executing File: ${name}', async () => {`,
      `     delete jest.resetMocks;`,
      `     delete jest.resetAllMocks;`,
      `     delete jest.resetModules;`,
      `     delete jest.resolver;`,
      `     delete jest.restoreAllMocks;`,
      `     const $world = ${worldStr};`,
      `    ${transformCode}`,
      `  })`,
      `})`
    ].join(`\n`)

    return {
      map,
      code,
    }
  }
}

export default waypointTransformer
