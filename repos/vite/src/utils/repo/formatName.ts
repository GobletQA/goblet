export const formatName = (name:string) => {
  return name.trim()
    .replace(/[`~!@#$%^&*()|+=?;:'",.<>\{\}\[\]\\\/\s]/gi, `-`)
}