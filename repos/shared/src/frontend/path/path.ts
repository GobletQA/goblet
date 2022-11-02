
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
const urlRe = /^((?:[^:\/]+:)?\/\/[^\/]*)(\/[^?#]*|)((?:\?[^#]*)?(?:#.*)?)$/

const splitPath = (filename:string) => {
  return splitPathRe.exec(filename).slice(1)
}

const normalizeArray = (parts:string[], allowAboveRoot:boolean) => {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (let i = parts.length - 1; i >= 0; i--) {
    const last = parts[i]
    if (last === '.') parts.splice(i, 1)
  
    else if (last === '..') {
      parts.splice(i, 1)
      up++
    }

    else if (up) {
      parts.splice(i, 1)
      up--
    }

  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot)
    for (; up--; up) parts.unshift('..')

  return parts
}

export const sep = '/'
export const delimiter = ':'
export const win32 = null
export const posix = null

export const getPath = (url:string) => {
  const result = urlRe.exec(url)
  return !result ? `` : result[2]
}

export const cwd = () => {
  const path = getPath((window as any)?.location)
  return foldername(path)
}

export const isAbsolute = (path:string) => {
  return path.charAt(0) === '/'
}

export const isDir = (path:string) => {
  return path.charAt(path.length - 1) === '/'
}

export const foldername = (path:string) => {
  return isDir(path) ? normalize(path) : dirname(path)
}

export const normalize = (path:string) => {
  const absolute = isAbsolute(path)
  const trailingSlash = isDir(path)

  path = normalizeArray(path.split('/').filter((part) => !!part), !absolute).join('/')

  if (!path && !absolute) path = '.'
  if (path && trailingSlash) path += '/'

  return (absolute ? '/' : '') + path
}

export const join = (...paths:string[]) => {
  return normalize(paths.filter((part) => {
    if (typeof part !== 'string')
      throw new TypeError('Arguments to path.join must be strings')

    return part
  }).join('/'))
}

export const relative = (from:string, to:string) => {
  from = resolve(from).substr(1)
  to = resolve(to).substr(1)

  function trim(arr:string[]) {
    let start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break
    }

    let end = arr.length - 1
    for (; end >= 0; end--) {
      if (arr[end] !== '') break
    }

    if (start > end) return []
    return arr.slice(start, end - start + 1)
  }

  const fromParts = trim(from.split('/'))
  const toParts = trim(to.split('/'))

  var length = Math.min(fromParts.length, toParts.length)
  var samePartsLength = length
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i
      break
    }
  }

  var outputParts = []
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..')
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength))

  return outputParts.join('/')
}

export const resolve = (...args:string[]) => {
  let resolvedPath = ''
  let resolvedAbsolute = false

  for (let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    const path = (i >= 0) ? args[i] : cwd()

    // Skip empty and invalid entries
    if (typeof path !== 'string')
      throw new TypeError('Arguments to path.resolve must be strings')
    else if (!path) continue

    resolvedPath = path + '/' + resolvedPath
    resolvedAbsolute = isAbsolute(path)
  }

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/')

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.'
}

export const dirname = (path:string) => {
  const result = splitPath(path)
  const root = result[0]
  let dir = result[1]

  if (!root && !dir) return '.'
  if (dir) dir = dir.substr(0, dir.length - 1)

  return root + dir
}

export const basename = (path:string, ext?:string) => {
  let end = splitPath(path)[2]

  if (ext && end.substr(-1 * ext.length) === ext)
    end = end.substr(0, end.length - ext.length)

  return end
}

export const extname = (path:string) => {
  return splitPath(path)[3]
}