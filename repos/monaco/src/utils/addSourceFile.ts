import { deepMerge } from '@keg-hub/jsutils'

export type TAddSrcFile = {
  path: string,
  value?: string,
  filetree: any,
  rootPrefix?: string,
}

export const addSourceFile = ({
  path,
  value,
  filetree,
  rootPrefix=``,
}:TAddSrcFile) => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  const name = paths[paths.length - 1]
  let temp = copy.children
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      temp[v] = {
        name,
        value: value || '',
        path,
        ext: name.split('.').pop() || `unknown`,
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
