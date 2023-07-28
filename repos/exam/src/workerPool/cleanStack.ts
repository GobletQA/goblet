
import type { TCleanStack } from '@GEX/types'

import os from 'os'
import {emptyObj} from '@keg-hub/jsutils'

const extractPathRegex = /\s+at.*[(\s](.*)\)?/
const pathRegex = /^(?:(?:(?:node|node:[\w/]+|(?:(?:node:)?internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)(?:\.js)?:\d+:\d+)|native)/

const getHomeDirectory = () => os.homedir().replace(/\\/g, '/');
const escapeStringRegexp = (string:string) => {
  return string
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}

export const cleanStack = (
  stack:string,
  opts:TCleanStack=emptyObj
) => {
  const {
    basePath,
    pathFilter,
    pretty=false,
  } = opts
  
  if (typeof stack !== 'string') return undefined

  const basePathRegex = basePath
    && new RegExp(`(file://)?${escapeStringRegexp(basePath.replace(/\\/g, '/'))}/?`, 'g')

  const homeDirectory = pretty ? getHomeDirectory() : ''

  return stack.replace(/\\/g, '/')
    .split('\n')
    .filter(line => {
      const pathMatches = line.match(extractPathRegex)

      if (pathMatches === null || !pathMatches[1]) return true

      const match = pathMatches[1]

      return pathFilter
        ? !pathRegex.test(match) && pathFilter(match)
        : !pathRegex.test(match)
    })
    .filter(line => line.trim() !== '')
    .map(line => {
      if (basePathRegex) line = line.replace(basePathRegex, '')
      if (pretty)
        line = line.replace(extractPathRegex, (m, p1) => m.replace(p1, p1.replace(homeDirectory, '~')))

      return line
    })
    .join('\n')
}
