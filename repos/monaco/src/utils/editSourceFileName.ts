import { deepCopy } from './deepCopy'

export function editSourceFileName(sourcetree: any, path: string, name: string) {
  const copy = deepCopy(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      temp[name] = {
        name,
        path: '/' + paths.slice(0, index).concat(name).join('/'),
        value: temp[v].value,
        _isFile: true,
      }
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