
export const titleFromPath = (path?:string) => {
  if(!path) return undefined

  const split = path?.split(`/`)?.pop()?.split(`.`)
  return split && split?.length > 1 ? split?.slice(0, -1) : split?.[0]

}