import { deepCopy } from './deepCopy'


function editSubFolder(tree: any, oldPath: string, newPath: string) {
  tree.path = tree.path.replace(oldPath, newPath)
  if (tree._isDirectory) {
    Object.keys(tree.children).forEach(v =>
      editSubFolder(tree.children[v], oldPath, newPath)
    )
  }
}

export function editSourceFolderName(sourcetree: any, path: string, name: string) {
  const copy = deepCopy(sourcetree)
  const paths = (path || '/').slice(1).split('/')
  let temp = copy.children
  const newPath = '/' + paths.slice(0, -1).concat(name).join('/')
  paths.forEach((v, index) => {
    if (index === paths.length - 1) {
      temp[name] = {
        name,
        path: newPath,
        children: temp[v].children,
        _isDirectory: true,
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

  editSubFolder(temp[name], path + '/', newPath + '/')
  return copy
}
