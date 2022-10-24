import { deepMerge } from '@keg-hub/jsutils'

export type TAddSrcFolder = {
  path: string
  value?: string
  filetree: any
  rootPrefix?: string
}

export const addSourceFolder = ({
  path,
  value,
  filetree,
  rootPrefix
}:TAddSrcFolder) => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((part:string, index:number) => {
    if (index === paths.length - 1) {
      temp[part] = {
        path,
        name: part,
        children: {},
        _isDirectory: true,
      }
    }
    else if (temp[part]) {
      temp = temp[part].children
    }
    else {
      temp[part] = {
        name: part,
        children: {},
        _isDirectory: true,
        path: '/' + paths.slice(0, index + 1).join('/'),
      }
      temp = temp[part].children
    }
  })
  return copy
}
