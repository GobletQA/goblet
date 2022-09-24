import { deepCopy } from './deepCopy'

export function addSourceFile(sourcetree: any, path: string, value?: string) {
  const copy = deepCopy(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  const name = paths[paths.length - 1]
  let temp = copy.children
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      temp[v] = {
        name,
        value: value || '',
        path,
        _isFile: true,
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
