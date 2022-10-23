import type { TFolder, TBuildFolder } from '../types'


export const buildFolder = ({
  path,
  name,
  paths,
  part,
  index,
  children={}
}:TBuildFolder):TFolder => {
  return {
    children,
    _isDirectory: true,
    name: name || part,
    path: path || '/' + paths.slice(0, index + 1).join('/'),
  }
}
