
export const clone = (obj:Record<any, any>, params:Record<any, any>) => {
  var cloned = {}
  let key:any
  for (key in obj)
    if (Object.prototype.hasOwnProperty.call(obj, key) && params.indexOf(key) < 0)
      cloned[key] = obj[key]

  if (null != obj && "function" == typeof Object.getOwnPropertySymbols) {
    let idx = 0
    key = Object.getOwnPropertySymbols(obj)
    for (; idx < key.length; idx++) {
      if (params.indexOf(key[idx]) < 0 && Object.prototype.propertyIsEnumerable.call(obj, key[idx])) {
        cloned[key[idx]] = obj[key[idx]]
      }
    }
  }

  return cloned
}
