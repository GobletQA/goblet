import { deepMerge } from '@keg-hub/jsutils'
import { buildFolder } from './buildFolder'

const editSubFolder = (tree: any, oldPath: string, newPath: string) => {
  tree.path = tree.path.replace(oldPath, newPath)
  if (tree._isDirectory) {
    Object.keys(tree.children).forEach(child =>
      editSubFolder(tree.children[child], oldPath, newPath)
    )
  }
}

export const editSourceFolderName = (sourcetree: any, path: string, name: string) => {
  const copy = deepMerge(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  const newPath = '/' + paths.slice(0, -1).concat(name).join('/')
  paths.forEach((part, index) => {
    if (index === paths.length - 1) {
      temp[name] = buildFolder({
        part,
        paths,
        name,
        index,
        path: newPath,
        children: temp[part].children,
      })
      delete temp[part]
    }

    else if (temp[part])
      return (temp = temp[part].children)
    else {
      temp[part] = buildFolder({
        index,
        paths,
        part,
      })

      temp = temp[part].children
    }
  })

  editSubFolder(temp[name], path + '/', newPath + '/')
  return copy
}
