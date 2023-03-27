

export const missing = (
  message:string,
  prefix:string=`[Missing Error]`,
  ...rest:any[]
) => {
  return console.warn(`${prefix} - Missing ${message}`, ...rest)
}
