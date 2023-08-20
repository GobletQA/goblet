import { deepMerge } from '@keg-hub/jsutils/deepMerge'
import { buildFolder } from './buildFolder'

export type TDelSrcFolder = {
  path: string
  filetree: any,
  rootPrefix?: string
}

export const deleteSourceFolder = ({
  path,
  filetree,
  rootPrefix
}: TDelSrcFolder) => {
  const copy = deepMerge(filetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children

  paths.forEach((part, index) => {
    if (index === paths.length - 1){
      delete temp[part]
      return
    }

    else if (temp[part])
      return (temp = temp[part].children)

    temp[part] = buildFolder({
      part,
      index,
      paths,
    })

    temp = temp[part].children

  })

  return copy
}
