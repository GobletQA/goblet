

export const getRelativeLoc = (location:string, rootDir?:string) => {
  return location?.replace(rootDir, ``).replace(/^\//, `./`)
}