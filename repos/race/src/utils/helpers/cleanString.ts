
/**
 * Cleans the passed in string
 */
export const cleanString = (name:string) => {
  return name.replace(/[\s`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
}
