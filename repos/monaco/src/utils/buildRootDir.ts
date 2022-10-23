import type { TRootDir } from '../types'


export const buildRootDir = ():TRootDir => {
  return {
    path: '/',
    children: {},
    isDirectory: true,
  }
}
