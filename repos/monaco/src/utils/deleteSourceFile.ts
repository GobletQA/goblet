import { deepMerge } from '@keg-hub/jsutils'
import { buildFolder } from './buildFolder'

export const deleteSourceFile = (sourcetree: any, path: string) => {
  const copy = deepMerge(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children

  paths.forEach((part, index) => {
    if (index === paths.length - 1) {
      delete temp[part]
      return
    }
    else if (temp[part])
      return (temp = temp[v].children)

    temp[part] = buildFolder({
      part,
      index,
      paths,
    })

    temp = temp[part].children

  })
  return copy
}