
export const titleFromPath = (path?:string) => {
  return path
    ? path?.split(`/`)?.pop()?.split(`.`).slice(0, -1) || undefined
    : undefined
}