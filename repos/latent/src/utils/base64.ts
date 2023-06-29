

export const toB64 = (item:string) => {
  const buff = Buffer.from(item, `utf8`)
  return buff.toString(`base64`)
}

export const fromB64 = (item:string) => {
  const buff = Buffer.from(item, `base64url`)
  return buff.toString(`utf8`)
}
