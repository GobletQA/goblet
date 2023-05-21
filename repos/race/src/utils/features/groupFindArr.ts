
/**
 * Builds an array of string used to find an Item in the featureGroups object
 * Can be used with `get` `set` and `unset` from `jsutils`
 */
export const groupFindArr = (loc:string) => {
  const parts = loc.split(`/`).filter(Boolean)
  const total = parts.length - 1

  return parts.reduce((acc, part, idx) => {
    const loc = `/${part}`

    const add = total === idx ? [loc] : [loc, `items`]

    acc.push(...add)

    return acc
  }, [] as string[])
}