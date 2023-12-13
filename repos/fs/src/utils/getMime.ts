import mime from 'mime'
import path from 'node:path'

/**
 * getType seemed to stop working, the owner of the package is doing odd things
 * So we normalize the getType and lookup methods incase one can't be found
 */
export const getMime = (location:string) => {
  const ext = path.extname(location).replace(`.`, ``)
  // @ts-ignore
  return mime?.types?.[ext] || mime?._types?.[ext] || `text/plain`
}
