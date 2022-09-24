import { deepCopy } from './deepCopy'

export function addSourceFolder(sourcetree: any, path: string, value?: string) {
  const copy = deepCopy(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      temp[v] = {
        children: {},
        path,
        _isDirectory: true,
        name: v,
      }
    }
    else if (temp[v]) {
      temp = temp[v].children
    }
    else {
      temp[v] = {
        _isDirectory: true,
        children: {},
        path: '/' + paths.slice(0, index + 1).join('/'),
        name: v,
      }
      temp = temp[v].children
    }
  })
  return copy
}
