import { deepMerge } from '@keg-hub/jsutils'
import { buildFile } from './buildFile'
import { buildFolder } from './buildFolder'

export type TEditSrcFileName = {
  name: string
  path: string
  filetree: any
  rootPrefix?: string
}

export const editSourceFileName = ({
  name,
  path,
  filetree,
  rootPrefix
}:TEditSrcFileName) => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((part, index) => {
    if (index === paths.length - 1) {
      const fullPath = '/' + paths.slice(0, index).concat(name).join('/')
      
      temp[name] = buildFile({
        part: name,
        rootPrefix,
        key: fullPath,
        content: temp[part].content,
      })

      delete temp[part]
      return
    }
    else if (temp[part])
      return (temp = temp[part].children)

    temp[part] = buildFolder({
      index,
      part,
      paths,
    })
    temp = temp[part].children

  })
  return copy
}