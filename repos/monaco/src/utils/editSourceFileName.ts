import { deepMerge } from '@keg-hub/jsutils'
import { buildFile } from './buildFile'
import { buildFolder } from './buildFolder'

export const editSourceFileName = (sourcetree: any, path: string, name: string) => {
  const copy = deepMerge(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  paths.forEach((part, index) => {
    if (index === paths.length - 1) {
      temp[name] = buildFile({
        part: name,
        value: temp[part].value,
        key: '/' + paths.slice(0, index).concat(name).join('/'),
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