import { deepMerge } from '@keg-hub/jsutils'

export type TAddSrcFile = {
  path: string,
  filetree: any,
  content?: string,
  rootPrefix?: string,
}

export const addSourceFile = ({
  path,
  filetree,
  content,
  rootPrefix=``,
}:TAddSrcFile) => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  const name = paths[paths.length - 1]
  let temp = copy.children

  paths.forEach((loc, index) => {

    if (index === paths.length - 1)
      temp[loc] = {
        name,
        path,
        content: content || '',
        ext: name.split('.').pop() || `unknown`,
      }
    
    else if (temp[loc]) temp = temp[loc].children

    else {
      temp[loc] = {
        _isDirectory: true,
        children: {},
        path: '/' + paths.slice(0, index + 1).join('/'),
        name: loc,
      }
      temp = temp[loc].children
    }

  })
  return copy
}
