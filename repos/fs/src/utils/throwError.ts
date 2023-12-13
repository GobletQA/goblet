export const throwError = (err:string|Error) => {
  if(typeof err !== `string`)
    throw err

  throw Error(err)
}