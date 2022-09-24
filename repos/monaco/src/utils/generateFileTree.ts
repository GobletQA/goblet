export function generateFileTree(files: any) {
  const keys = Object.keys(files)
  const tree = {
    isDirectory: true,
    children: {},
    path: '/',
  }
  keys.forEach(key => {
    const path = key.slice(1).split('/')
    let temp: any = tree.children
    path.forEach((v, index) => {
      if (index === path.length - 1) {
        temp[v] = {
          name: v,
          path: key,
          value: files[key],
          _isFile: true,
        }
      }
      else if (temp[v]) {
        temp = temp[v].children
      }
      else {
        temp[v] = {
          _isDirectory: true,
          children: {},
          path: '/' + path.slice(0, index + 1).join('/'),
          name: v,
        }
        temp = temp[v].children
      }
    })
  })
  return tree
}
