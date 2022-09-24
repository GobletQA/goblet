import { deepCopy } from './deepCopy'

export function deleteSourceFile(sourcetree: any, path: string) {
  const copy = deepCopy(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      delete temp[v]
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